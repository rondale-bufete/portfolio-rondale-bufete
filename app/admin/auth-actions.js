"use server";

import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession } from "@/lib/auth";

export async function loginAction(formData) {
    const password = formData.get("password");

    if (!checkPassword(password)) {
        return { error: "Incorrect password." };
    }

    await createSession();
    redirect("/admin");
}

export async function logoutAction() {
    await destroySession();
    redirect("/admin/login");
}
