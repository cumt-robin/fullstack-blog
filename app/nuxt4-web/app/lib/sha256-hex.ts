export const sha256Hex = async (plain: string): Promise<string> => {
    if (import.meta.server) {
        const { createHash } = await import("node:crypto");
        return createHash("sha256").update(plain).digest("hex");
    }
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(plain));
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
};
