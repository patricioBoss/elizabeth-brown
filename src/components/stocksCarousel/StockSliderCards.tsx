import Image from "next/image";
import React from "react";
import { Typography } from "@mui/material";
import numeral from "numeral";
import stocks from "../../helpers/stocks";
import Iconify from "../iconify";

const StockSliderCards = ({ stockData }: { stockData: any }) => {
  // console.log(stockData);
  return (
    <div className=" w-full h-full rounded-[2rem] p-4 flex flex-col justify-between">
      <div className=" flex justify-between mb-8">
        <Image
          src={(stocks as any)[stockData.symbol]?.imgUrl || '/img/default.png'}
          className=" rounded-full"
          width={70}
          height={70}
          alt="stock"
        />
        <div className=" bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center p-2">
          <div
            className={`${
              stockData.regularMarketChangePercent >= 0
                ? " text-green-500"
                : "text-red-500"
            } `}
          >
            <Iconify
              width={35}
              height={35}
              icon={
                stockData.regularMarketChangePercent >= 0
                  ? "eva:trending-up-fill"
                  : "eva:trending-down-fill"
              }
            />
          </div>
        </div>
      </div>
      <div className="mb-10 flex justify-between">
        <div className=" flex flex-col items-start ">
          <Typography
            sx={{ color: "white", lineHeight: 1, textAlign: "left", mb: 1 }}
            variant="h5"
          >
            {stockData.shortName}
          </Typography>
          <p className=" text-xs text-gray-300">{stockData.symbol} . NASDAQ</p>
        </div>
        <div className=" flex flex-col items-start self-end">
          <p className=" text-[10px] leading-[.5rem] text-gray-300">
            Current price
          </p>
          <Typography sx={{ color: "white" }} variant="h3">
            {`${numeral(stockData.regularMarketPrice).format("0,0.00")}`}
            <span className="text-sm leading-[.5rem] font-normal text-gray-300">
              USD
            </span>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default StockSliderCards;
