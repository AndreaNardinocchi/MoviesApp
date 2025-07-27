import React from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface ArrowProps {
  direction: "left" | "right";
  clickFunction: () => void;
}

const Arrow: React.FC<ArrowProps> = ({ direction, clickFunction }) => {
  const icon = direction === "left" ? <ChevronLeft /> : <ChevronRight />;

  return (
    <div
      onClick={clickFunction}
      style={{
        /**
         * The position 'absolute' style makes the element the arrow completely
         * independent of the normal elements flow. Instead of flowing along with
         * them other, it gets positioned exactly where we tell it to be with
         * the below property 'top: 50%'.
         * https://www.w3schools.com/Css/css_positioning.asp
         */
        position: "absolute",
        top: "50%",
        /**
         * The square brackets [] allow us to use a variable as a key in the object.
         * Hence, we are using 'direction' from 'ArrowProps', so that it dynamically
         * applies either `left: 0` or `right: 0` based on the direction
         * https://www.freecodecamp.org/news/how-to-set-dynamic-object-properties-using-computed-property-names/?
         *
         * */
        [direction]: 0,
        // Adjust the vertical position so the center of the arrow aligns with the center of the container
        // https://stackoverflow.com/questions/46184458/transform-translate-50-50
        transform: "translateY(-50%)",
        // Ensure the arrow sits above other content if overlapping
        zIndex: 10,
        cursor: "pointer",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "50%",
        padding: "0.5rem",
        margin: "0 0.5%",
        // https://daily-dev-tips.com/posts/delay-your-css-animations-to-make-them-cleaner/
        transition: "background 0.2s ease-in-out",
      }}
    >
      {icon}
    </div>
  );
};

export default Arrow;

/**
 * This component was built out by adjusting the snippet in https://blog.karenying.com/posts/adding-transitions-to-a-react-carousel-with-material-ui
 *
 * import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
 * function Arrow(props) {
 * const { direction, clickFunction } = props;
 * const icon = direction === 'left' ? <FaChevronLeft /> : <FaChevronRight />;
 * return <div onClick={clickFunction}>{icon}</div>;
 * }
 */
