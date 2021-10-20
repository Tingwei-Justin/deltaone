import "tailwindcss/tailwind.css";
import "./styles.css";
import "./styles/Join.css";
import dynamic from "next/dynamic";

const WalletConnectionProvider = dynamic(() => import("../components/WalletConnectionProvider"), {
    ssr: false,
});
function MyApp({ Component, pageProps }) {
    return (
        <WalletConnectionProvider>
            <Component {...pageProps} />
        </WalletConnectionProvider>
    );
}

export default MyApp;
