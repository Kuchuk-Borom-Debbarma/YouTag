import {SERVER_URI} from "../../utils/Constants.ts";
import type User from "../../models/User.ts";

export async function getGoogleLoginUrl(): Promise<string | null> {
    const url: string = `${SERVER_URI}/public/auth/login/google`;
    const response = await fetch(url);
    if (response.status != 200)
        return null;
    const jsonBody = await response.json();
    return jsonBody['data'];
}

export async function exchangeCodeForToken(code: string, state: string): Promise<string | null> {
    const url = `${SERVER_URI}/public/auth/redirect/google?code=${code}&state=${state}`;
    const response = await fetch(url);
    const jsonBody = await response.json();
    return jsonBody['data'];
}

export async function getUserInfo(token: string): Promise<User | null> {
    const url = `${SERVER_URI}/authenticated/auth/user`;
    const response = await fetch(url, {
        headers: {Authorization: `Bearer ${token}`},
    })
    if (response.status != 200) return null;
    const jsonBody = await response.json();
    return parseJsonDataToUser(jsonBody['data']);
}


export async function deleteProfile(token: string): Promise<void> {
    const url = `${SERVER_URI}/authenticated/auth/user`;
    await fetch(url, {
        headers: {Authorization: `Bearer ${token}`},
        method: "DELETE",
    })
}

function parseJsonDataToUser(jsonData: any): User | null {
    return {
        email: jsonData['email'],
        name: jsonData['name'],
        thumbnailUrl: jsonData['pic'],
    }
}

export  const prerender = false