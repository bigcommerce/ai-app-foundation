export function bigCommerceSDK(context: string | string[]) {
    if (typeof window === "undefined") return;

    const s = 'script';
    const id = 'bigcommerce-sdk-js';
    const d = document;
    const bcjs = d.getElementsByTagName(s)[0];

    if (d.getElementById(id)) return;

    const js = d.createElement(s);
    js.id = id;
    js.async = true;
    js.src = "https://cdn.bigcommerce.com/jssdk/bc-sdk.js";

    bcjs?.parentNode?.insertBefore(js, bcjs);

    window.bcAsyncInit = () =>
        Bigcommerce.init({
            onLogout: () => void fetch(`/api/logout?context=${context.toString()}`),
        });
}
