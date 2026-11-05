import * as React from "react";

// React's <ViewTransition> ships in the React build that Next's App Router
// bundles (node_modules/next/dist/docs/01-app/02-guides/view-transitions.md).
// Plain React, which the tests run on, doesn't export it yet, so fall back to
// rendering the children unchanged.
const ViewTransition = React.ViewTransition ?? function PassThrough({ children }) {
    return children;
};

// Elements sharing a name morph into each other when navigating between
// pages (a project card's title into the project page heading).
export default function Morph({ name, children }) {
    return (
        <ViewTransition name={name} share="morph" default="none">
            {children}
        </ViewTransition>
    );
}
