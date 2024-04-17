import React, { Fragment } from "react";
import PropTypes from "prop-types";

function SamplePage({ style, redirectToSample, modelPath, sampleId, ...otherProps }) {
  const iframeStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",  // Updated to 100% width
    height: "100%",
    border: "none",
    outline: "none",
  };

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
  };


  return (
    <Fragment className="sample-page-container">
      {!redirectToSample && (
        <div style={{ ...containerStyle, ...style }} {...otherProps}>
          <iframe title="3D Vista Project" src={modelPath} style={iframeStyle} sandbox="allow-scripts allow-same-origin allow-top-navigation allow-popups allow-popups-to-escape-sandbox" allowFullScreen></iframe>
        </div>
      )}
    </Fragment>
  );
}

SamplePage.propTypes = {
  style: PropTypes.object,
  redirectToSample: PropTypes.bool,
};

SamplePage.defaultProps = {
  style: {
    width: "100vw",
    height: "100vh"
  },
  redirectToSample: false, // Default value, won't redirect by default
};

export default SamplePage;
