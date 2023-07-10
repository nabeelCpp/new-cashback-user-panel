//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
//  MUI imports
//----------
import { Grid, Box, Typography, Card } from "@mui/material";

//----------
//  Other Libraries import
//----------
import { Table, Input } from "antd";
import axios from "axios";

//----------
//  Local Imports
//----------
import { useAuth } from "src/hooks/useAuth";

//----------
//  Constants
//----------
const sorter = ["ascend", "descend"];

const LevelIncome = () => {
  //----------
  //  States
  //----------
  const auth = useAuth();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchedText, setSearchedText] = useState("");

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/earning-reports/level-income`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setData(response.data);
          let total = 0;
          response.data.map((d) => {
            total += parseFloat(d.credit_amt);
          });
          setTotal(total);
        })
        .catch((error) => {
          toast.error(
            `${error.response ? error.response.status : ""}: ${
              error.response ? error.response.data.message : error
            }`
          );
          if (error.response && error.response.status == 401) {
            auth.logout();
          }
        });
    };
    loadData();
  }, []);

  //----------
  //  Table Configurations
  //----------
  const columns = [
    {
      title: "SN#",
      dataIndex: "sn",
      key: "sn",
      width: 60,
      sorter: (a, b) => a.sn - b.sn,
    },
    {
      title: "User Id",
      dataIndex: "user_id",
      key: "user_id",
      width: 200,
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.user_id)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.full_name)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.investment)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.percentage)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.credit_amt)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.date)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.status)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim())
        );
      },
    },
    {
      title: "User Name",
      dataIndex: "full_name",
      key: "full_name",
      width: 200,
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: `Investment (${process.env.NEXT_PUBLIC_CURRENCY})`,
      dataIndex: "investment",
      key: "investment",
      width: 200,
      sorter: (a, b) => a.investment - b.investment,
      render: (_, record) =>
        new Intl.NumberFormat(`${localStorage.localization}`, {
          style: "currency",
          currency: process.env.NEXT_PUBLIC_CURRENCY,
        }).format(record.investment),
    },
    {
      title: "Percentage(%)",
      dataIndex: "percentage",
      key: "percentage",
      width: 140,
      sorter: (a, b) => a.percentage - b.percentage,
    },
    {
      title: `Amount (${process.env.NEXT_PUBLIC_CURRENCY})`,
      dataIndex: "credit_amt",
      key: "credit_amt",
      width: 100,
      sorter: (a, b) => a.credit_amt - b.credit_amt,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 250,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (_, record) =>
        `${new Date(record.date).toLocaleDateString()} ${new Date(
          record.date
        ).toLocaleTimeString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ my: 8 }}>
            LEVEL INCOME REPORT
          </Typography>
        </Box>
      </Grid>

      <Card component="div" sx={{ position: "relative", mb: 7, p: 7 }}>
        <Input.Search
          placeholder="Search here....."
          style={{
            maxWidth: 300,
            marginBottom: 8,
            display: "block",
            height: 50,
            float: "right",
            border: "black",
          }}
          onSearch={(value) => {
            setSearchedText(value);
          }}
          onChange={(e) => {
            setSearchedText(e.target.value);
          }}
        />
        <Table
          columns={columns}
          dataSource={data}
          loading={false}
          sortDirections={sorter}
          pagination={
            data?.length > 0
              ? {
                  defaultCurrent: 1,
                  total: data?.length,
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) => `Total: ${total}`,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  locale: { items_per_page: "" },
                }
              : false
          }
        />

        <Typography variant="h6" align="right" sx={{ p: 5 }}>
          Total: {total.toLocaleString(undefined, { minimumFractionDigits: 0 })}
        </Typography>
      </Card>
    </>
  );
};

export default LevelIncome;
