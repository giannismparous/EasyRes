import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    cursor: redirectToSample ? "pointer" : "default",
    zIndex: 1,
  };

  const navigate = useNavigate();

  const handleOverlayClick = () => {
    // Redirect to "/sample" only if redirectToSample is true
    if (redirectToSample) {
      let redirectUrl = "";
      switch (sampleId) {
        case 1:
          redirectUrl = "/sample";
          break;
        case 2:
          redirectUrl = "/projects/1";
          break;
        case 3:
          redirectUrl = "/projects/2";
          break;
        case 4:
          redirectUrl = "/projects/3";
          break;
        case 5:
          redirectUrl = "/3d-model-sample";
          break;
        default:
          redirectUrl = "/";
          break;
      }
      console.log("Redirecting to", redirectUrl);
      window.open(redirectUrl, "_blank"); // Open in a new tab
    }
  };

  return (
    <Fragment className="sample-page-container">
      {redirectToSample && (
        <div style={{ ...containerStyle, ...style }} {...otherProps}>
          <iframe title="3D Vista Project" src={modelPath} style={iframeStyle} sandbox="allow-scripts allow-same-origin allow-top-navigation allow-popups allow-popups-to-escape-sandbox" allow="xr-spatial-tracking; accelerometer; gyroscope; vr; fullscreen" allowFullScreen></iframe>
          <div className="overlay" style={overlayStyle} onClick={handleOverlayClick}></div>
        </div>
      )}
      {!redirectToSample && (
        <div style={{ ...containerStyle, ...style }} {...otherProps}>
          <iframe title="3D Vista Project" src={modelPath} style={iframeStyle} sandbox="allow-scripts allow-same-origin allow-top-navigation allow-popups allow-popups-to-escape-sandbox" allow="xr-spatial-tracking; accelerometer; gyroscope; vr; fullscreen" allowFullScreen></iframe>
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
  modelPath: "/samples/sample1/index.htm"
};

export default SamplePage;
