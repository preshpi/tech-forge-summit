'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
 return <main className="qh"><div className="container"><div className="qh-empty" role="alert"><h1>Questions are temporarily unavailable</h1><p>Please try again in a moment.</p><button className="btn btn--primary" onClick={reset}>Try again</button></div></div></main>;
}
