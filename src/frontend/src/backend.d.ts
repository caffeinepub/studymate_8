import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Video {
    title: string;
    duration: string;
    creator_name: string;
    subject: string;
    description: string;
    is_published: boolean;
    thumbnail_url: string;
}
export interface Textbook {
    title: string;
    subject: string;
    description: string;
    author: string;
    price: string;
    seller_name: string;
    condition: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPublishedVideos(): Promise<Array<[bigint, Video]>>;
    getAllTextbooks(): Promise<Array<[bigint, Textbook]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    insertTextbook(textbook: Textbook): Promise<bigint>;
    insertVideo(video: Video): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
