interface Window {
    bcAsyncInit?: () => void;
}

declare namespace Bigcommerce {
    function init(config: { onLogout: () => void }): void;
}
