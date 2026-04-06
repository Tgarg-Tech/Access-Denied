import { FunctionComponent } from "react";
import { Box, Typography } from "@mui/material";
import FrameComponent1 from "../components/FrameComponent1";
import FrameComponent from "../components/FrameComponent";
import FrameComponent2 from "../components/FrameComponent2";
import Service from "../components/Service";
import Service2 from "../components/Service2";
import Service1 from "../components/Service1";
import FrameComponent3 from "../components/FrameComponent3";
import Stories from "../components/Stories";
import FrameComponent4 from "../components/FrameComponent4";
import styles from "./HackMate.module.css";

const HackMate: FunctionComponent = () => {
  return (
    <Box className={styles.hackmate}>
      <main className={styles.frameParent}>
        <Box className={styles.frameWrapper}>
          <FrameComponent1 />
        </Box>
        <FrameComponent />
      </main>
      <FrameComponent2 />
      <section className={styles.hackmateInner}>
        <Box className={styles.smartFeaturesForSmarterTeaParent}>
          <Typography
            className={styles.smartFeaturesForContainer}
            variant="inherit"
            variantMapping={{ inherit: "h2" }}
            sx={{ lineHeight: "var(--lh-120)" }}
          >
            <Typography
              variant="inherit"
              variantMapping={{ inherit: "span" }}
              sx={{ fontWeight: "500" }}
            >{`Smart `}</Typography>
            <i className={styles.features}>Features</i>
            <Typography
              variant="inherit"
              variantMapping={{ inherit: "span" }}
              sx={{ fontWeight: "500" }}
            >{` `}</Typography>
            <i className={styles.for}>for</i>
            <Typography
              variant="inherit"
              variantMapping={{ inherit: "span" }}
              sx={{ fontWeight: "500" }}
            >{` Smarter `}</Typography>
            <i className={styles.features}>Teams</i>
          </Typography>
          <Typography
            className={styles.everythingYouNeed}
            variant="inherit"
            variantMapping={{ inherit: "h3" }}
            sx={{
              fontWeight: "300",
              fontSize: "25px",
              lineHeight: "var(--lh-120)",
            }}
          >
            Everything you need to connect, collaborate, and win hackathons.
          </Typography>
        </Box>
      </section>
      <section className={styles.hackmateChild}>
        <Box className={styles.serviceParent}>
          <Service />
          <Service2 />
          <Service1 />
        </Box>
      </section>
      <FrameComponent3 />
      <Stories />
      <section className={styles.advancedWorld}>
        <Box className={styles.smarterWorld}>
          <section className={styles.shapingASmarterMoreAdvancParent}>
            <Typography
              className={styles.shapingASmarterContainer}
              variant="inherit"
              variantMapping={{ inherit: "h1" }}
              sx={{ lineHeight: "var(--lh-120)" }}
            >
              <Typography
                variant="inherit"
                variantMapping={{ inherit: "span" }}
                sx={{ fontWeight: "500" }}
              >{`Shaping a `}</Typography>
              <i className={styles.features}>Smarter</i>
              <Typography
                variant="inherit"
                variantMapping={{ inherit: "span" }}
                sx={{ fontWeight: "500" }}
              >{`, More `}</Typography>
              <i className={styles.features}>Advanced</i>
              <Typography
                variant="inherit"
                variantMapping={{ inherit: "span" }}
                sx={{ fontWeight: "500" }}
              >
                {" "}
                World
              </Typography>
            </Typography>
            <Box className={styles.eraInnovation}>
              <div className={styles.weAreShaping}>
                we are shaping the next era of technological innovation. With
                cutting-edge solutions.
              </div>
            </Box>
          </section>
          <img
            className={styles.videoIcon}
            loading="lazy"
            alt=""
            src="/Video@2x.png"
          />
        </Box>
      </section>
      <FrameComponent4 />
    </Box>
  );
};

export default HackMate;
