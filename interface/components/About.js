import React from 'react';

class About extends React.Component {
  render() {
    const appIconPath = `file://${window.dirname}/icons/${
      window.mistMode
    }/icon2x.png`;
    const appName = window.mistMode === 'mist' ? 'Mist' : 'Auxilium Wallet';

    return (
      <div className="row popup-windows about">
        <div className="col col-4 ">
          <img
            className={`left-overlay ${window.mistMode}`}
            src={appIconPath}
            style={{
              position: 'relative',
              top: '-40px',
              left: '-132%',
              width: '255%'
            }}
          />
        </div>
        <div className="col col-8 ">
          <h1>{appName}</h1>
          <p>
            Version {window.mist.version}
            <br />
            License {window.mist.license}
            <br />
            GitHub{' '}
            <a href="https://github.com/auxiliumglobal/mist" target="_blank">
              github.com/auxiliumglobal/mist
            </a>
          </p>
          <small>Copyright 2018 Auxilium Global</small>
        </div>
      </div>
    );
  }
}

export default About;
