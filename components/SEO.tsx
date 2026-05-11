import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    noindex?: boolean;
}

const DEFAULTS = {
    title: 'Orbact | AI Engineering & Automation Collective',
    description: 'We build custom AI agents, neural architectures, and high-performance web apps to scale your business. Stop hiring, start shipping.',
    image: '/orbact-icon.svg',
    url: import.meta.env.VITE_SITE_URL || 'https://orbact.com',
    siteName: 'Orbact',
};

const SEO: React.FC<SEOProps> = ({
    title = DEFAULTS.title,
    description = DEFAULTS.description,
    image = DEFAULTS.image,
    url = DEFAULTS.url,
    type = 'website',
    noindex = false,
}) => {
    const canonicalUrl = url.startsWith('http') ? url : `${DEFAULTS.url}${url || window.location.pathname}`;
    const fullImageUrl = image.startsWith('http') ? image : `${DEFAULTS.url}${image}`;

    return (
        <Helmet>
            {/* Primary Meta */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={DEFAULTS.siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:site" content="@Orbactai" />

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Additional */}
            <meta name="theme-color" content="#0b0b0f" />
        </Helmet>
    );
};

export default SEO;
