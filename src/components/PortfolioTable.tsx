import { sentenceCase } from "change-case";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  TableContainer,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// utils
import { fDate } from "../utils/formatTime";
import { fCurrency, fPercent } from "../utils/formatNumber";
import Scrollbar from "./scrollbar";
import PropTypes from "prop-types";
import Link from "next/link";
import Label from "./label";
import stocks from "../helpers/stocks";
// _mock_
// import { _appInvoices } from '../../.../_mock';
// components
PortfolioList.propTypes = {
  row: PropTypes.array,
};
// ----------------------------------------------------------------------

export default function PortfolioList({ row }: { row: any[] }) {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader title="Financial Portfolio List" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Change</TableCell>
                <TableCell>Ask</TableCell>
                <TableCell>Bid</TableCell>
                <TableCell> % Change</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {row.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell>
                    <div className=" flex flex-col w-fit">
                      <div
                        style={{ background: (stocks as any)[row.symbol]?.bg || '#666' }}
                        className=" rounded-md text-white text-center px-1 font-medium mb-2 w-fit"
                      >
                        {row.symbol}
                      </div>
                      <Typography
                        sx={{
                          color: "black",
                          lineHeight: 1,
                        }}
                        variant="body1"
                      >
                        {row.shortName}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fCurrency(row.regularMarketPrice)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fCurrency(row.regularMarketChange)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fCurrency(row.ask)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fCurrency(row.bid)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div
                      className={` rounded-md font-semibold p-2 md:text-base text-center md:w-[100px] ${
                        row.regularMarketChangePercent >= 0
                          ? " bg-[#36b37e29] text-[#1b806a]"
                          : "bg-[#ff563029] text-[#b71d18]"
                      }`}
                    >
                      {fPercent(row.regularMarketChangePercent)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Link href="/dashboard/portfolio">
          <Button
            size="small"
            color="inherit"
            endIcon={<ArrowForwardIosIcon />}
          >
            View All
          </Button>
        </Link>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------
