import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
    type?: 'organization' | 'service' | 'faq';
    data?: any;
}

/**
 * Renders JSON-LD structured data for better search engine understanding.
 * Supports Organization, Service, and FAQ schemas.
 */
const StructuredData: React.FC<StructuredDataProps> = ({ type = 'organization', data }) => {
    const getSchema = () => {
        switch (type) {
            case 'organization':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Orbact',
                    url: 'https://orbact.com',
                    logo: 'https://orbact.com/logo.png',
                    description: 'AI Engineering & Automation Collective — Custom AI agents, neural architectures, and full-stack digital products.',
                    sameAs: [
                        'https://x.com/Orbactai',
                        'https://github.com/orbact',
                        'https://www.linkedin.com/company/orbact'
                    ],
                    contactPoint: {
                        '@type': 'ContactPoint',
                        email: 'hello@orbact.com',
                        contactType: 'sales',
                        availableLanguage: ['English']
                    }
                };

            case 'service':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    serviceType: data?.title || 'AI Engineering',
                    provider: {
                        '@type': 'Organization',
                        name: 'Orbact'
                    },
                    description: data?.description || 'Custom AI solutions for modern businesses.',
                    areaServed: 'Worldwide'
                };

            case 'faq':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: (data?.faqs || []).map((faq: { q: string; a: string }) => ({
                        '@type': 'Question',
                        name: faq.q,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: faq.a
                        }
                    }))
                };

            default:
                return null;
        }
    };

    const schema = getSchema();
    if (!schema) return null;

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

export default StructuredData;
