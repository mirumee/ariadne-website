import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

export default function Enterprise() {
  return (
    <Layout title="Enterprise">
      <div style={{
        backgroundImage: "url('/img/enterprise-hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)",
          pointerEvents: "none",
        }} />
       <div className="container" style={{position: "relative"}}>
         <div style={{maxWidth: "560px", textAlign: "left", color: "white"}}>
          <h1 style={{color: "white", fontSize: "2.5rem"}}>Proven at Global Scale</h1>
          <p style={{fontSize: "1.1rem", marginBottom: "1rem"}}>
            Ariadne is trusted by industry leaders from streaming giants to innovative medtech and commerce platforms.
          </p>
          <p style={{fontSize: "1.1rem", marginBottom: "1rem"}}>
            When performance and reliability are not optional, we provide the architectural expertise to help your team build faster and scale with confidence.
          </p>
          <p style={{fontSize: "1.1rem", marginBottom: "2rem"}}>
            Need a custom implementation or expert architectural review? Let's talk about your project.
          </p>
          <Link
            className="button button--primary button--lg"
            href="https://mirumee.com/contact?utm_campaign=ariadne&utm_medium=ariadne_page&utm_source=enterprise_CTA&to=24022103"
            style={{borderRadius: "6px"}}
          >
            Talk to the Creators
          </Link>
        </div>
        </div>
      </div>
    </Layout>
  );
}