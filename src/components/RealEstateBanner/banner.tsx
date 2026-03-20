import React from "react";
import { Button, Typography } from "@mui/material";
import Link from "next/link";

const Banner = ({ reel }: { reel: any }) => {
  // console.log(stockData);
  return (
    <div className=" w-full h-[200px] md:h-[240px] flex flex-col justify-between overflow-hidden relative">
      <img
        src={reel.imgUrl}
        className="absolute bottom-[-10%] -left-[20%] md:left-[5%] scale-150 md:scale-90 md:w-full"
      />
      <div className="flex">
        <div className="md:flex-1 px-6 pt-6">
          <div className="flex items-start flex-col md:">
            <Typography
              className="text-sm md:text-xl"
              component={"h5"}
              sx={{ lineHeight: 1, textAlign: "left", mb: 1 }}
              variant="h3"
            >
              {reel.title}
            </Typography>
            <Typography
              className="text-xs md:text-base"
              sx={{ textAlign: "left", mb: 1 }}
              variant="body1"
            >
              {reel.paragraph}
            </Typography>
            <Link href={"/dashboard/realestate"}>
              <Button variant="contained" color="error">
                Invest Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:flex-1"></div>
      </div>
    </div>
  );
};

export default Banner;
