import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import MotionProvider from "./motion/MotionProvider";

export default function PublicSite({ profile, sections = [], children }) {
    return (
        <div id="top" className="portfolio-site">
            <MotionProvider />
            <Navbar profile={profile} sections={sections} />
            <main>{children}</main>
            <Footer profile={profile} />
            {profile?.chatVisible !== false && <ChatWidget />}
        </div>
    );
}
