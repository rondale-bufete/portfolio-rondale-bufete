import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

export default function PublicSite({ profile, sections = [], children }) {
    return (
        <div className="portfolio-site">
            <Navbar profile={profile} sections={sections} />
            <main>{children}</main>
            <Footer profile={profile} />
            <ChatWidget />
        </div>
    );
}