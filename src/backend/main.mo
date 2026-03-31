import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type Video = {
    title : Text;
    subject : Text;
    description : Text;
    creator_name : Text;
    duration : Text;
    thumbnail_url : Text;
    is_published : Bool;
  };

  type Textbook = {
    title : Text;
    author : Text;
    subject : Text;
    price : Text;
    condition : Text;
    description : Text;
    seller_name : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  module Video {
    public func compareByDescendingId(v1 : (Nat, Video), v2 : (Nat, Video)) : Order.Order {
      Nat.compare(v2.0, v1.0);
    };
  };

  module Textbook {
    public func compareByDescendingId(tb1 : (Nat, Textbook), tb2 : (Nat, Textbook)) : Order.Order {
      Nat.compare(tb2.0, tb1.0);
    };
  };

  // Persistent state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let videos = Map.empty<Nat, Video>();
  var nextVideoId = 0;

  let textbooks = Map.empty<Nat, Textbook>();
  var nextTextbookId = 0;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public queries for published videos and textbooks
  public query func getAllPublishedVideos() : async [(Nat, Video)] {
    videos.entries().toArray().filter(
      func((_, video)) { video.is_published }
    ).sort(Video.compareByDescendingId);
  };

  public query func getAllTextbooks() : async [(Nat, Textbook)] {
    textbooks.entries().toArray().sort(Textbook.compareByDescendingId);
  };

  // Authorized mutations
  public shared ({ caller }) func insertVideo(video : Video) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can insert videos");
    };
    let id = nextVideoId;
    videos.add(id, video);
    nextVideoId += 1;
    id;
  };

  public shared ({ caller }) func insertTextbook(textbook : Textbook) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can insert textbooks");
    };
    let id = nextTextbookId;
    textbooks.add(id, textbook);
    nextTextbookId += 1;
    id;
  };
};
