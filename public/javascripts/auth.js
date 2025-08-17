function getCookiesFromHash() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    let cookies = {};
    for (const [key, value] of params.entries()) {
        cookies[key] = value;
    }
    return cookies;
}

const cookies = getCookiesFromHash();
if (!cookies["access_token"]) {
    window.location.replace = `/`
} else{
    document.cookie = `access_token=${cookies["access_token"]}; path=/; domain=localhost; SameSite=Lax; max-age=${7 * 24 * 60 * 60}`; /* secure;*/
    window.location.replace("/"); // redirect to your desired page
}