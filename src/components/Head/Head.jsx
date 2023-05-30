import { Helmet } from 'react-helmet';

function Head({ title }) {
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>VNVC - {title}</title>
            {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
    );
}

export default Head;
