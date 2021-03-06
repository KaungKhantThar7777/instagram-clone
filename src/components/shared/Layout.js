import React from "react";

import { useLayoutStyles } from "../../styles";
import SEO from "./Seo";
import Navbar from "./Navbar";

function Layout({ children, title, marginTop = 60, minimalNavbar = false }) {
  const classes = useLayoutStyles();

  return (
    <section className={classes.section}>
      <SEO title={title} />
      <Navbar minimalNavbar={minimalNavbar} />
      <main className={classes.main}>
        <section className={classes.childrenWrapper} style={{ marginTop }}>
          <div className={classes.children}>{children}</div>
        </section>
      </main>
    </section>
  );
}

export default Layout;
