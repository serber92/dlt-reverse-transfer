import React from "react";
import "../GridBox.css";

const GridBoxChart = () => {
  return (
    <div className="GridBox">
      <h1>Credit History</h1>
      <Grid
        data={[
          { semester: "Fall", year: 2009, credits: 12 },

          { semester: "Spring", year: 2010, credits: 8 },
          { semester: "Summer", year: 2010, credits: 6 },
          { semester: "Fall", year: 2010, credits: 12 },

          { semester: "Spring", year: 2011, credits: 15 },
          { semester: "Fall", year: 2011, credits: 12 },

          { semester: "Spring", year: 2012, credits: 12 },
          { semester: "Summer", year: 2012, credits: 3 },
          { semester: "Fall", year: 2012, credits: 12 },

          { semester: "Spring", year: 2013, credits: 12 },
          { semester: "Fall", year: 2013, credits: 12 },

          { semester: "Spring", year: 2019, credits: 12 },
          { semester: "Fall", year: 2019, credits: 8 },
        ]}
      />
    </div>
  );
};

const GridBox = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="70" width="70">
      <g transform="translate(3,3)">
        <rect id="rounded-rectangle" x="0" y="0" height="62" width="62" stroke={props.borderColor} rx="5" stroke-width="1" fill={props.fillColor} />
        <text x="45%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="white">
          {props.name}
        </text>
      </g>
    </svg>
  );
};

const Grid = (props) => {
  var totalCredits = 0;
  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      {["Spring", "Summer", "Fall"].map((outer_value, outer_index) => {
        return (
          <div>
            <span
              style={{
                position: "fixed",
                transform: "translate(-510px,30px)",
                fontSize: "10pt",
              }}
            >
              {outer_value}
            </span>
            <div>
              {[2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020].map((value, index) => {
                let res = props.data.filter((x) => x.semester === outer_value && x.year === value);

                let color = "rgba(140,29,64,0.0)";
                let count = "";

                if (res.length > 0) {
                  count = res[0].credits;

                  totalCredits += count;
                  let alpha = res[0].credits / 21;
                  color = "rgba(140,29,64," + alpha + ")";
                }

                return (
                  <React.Fragment>
                    {outer_index === 0 && (
                      <span
                        style={{
                          position: "fixed",
                          transform: "translate(20px, 220px )",
                          fontSize: "10pt",
                        }}
                      >
                        {value}
                      </span>
                    )}

                    <GridBox name={count} fillColor={color} borderColor={"black"} />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridBoxChart;
