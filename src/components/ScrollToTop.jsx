import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = ({ t }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            className={`scroll-top-btn ${visible ? "visible" : ""}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t.scrollTopLabel}
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};

export default ScrollToTop;