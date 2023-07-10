//----------
//  React import
//----------
import { useEffect, useState } from "react";

//----------
//  MUI imports
//----------
import { Box, Typography, Card,Grid } from "@mui/material";

//----------
//  Other Libraries Imports
//----------
import { Table, Input } from "antd";
import axios from "axios";

//----------
//  Local Imports
//----------
import { useAuth } from "src/hooks/useAuth";

const PackagePurchase = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [searchedText, setSearchedText] = useState("");

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  // Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/invoice/package-purchase`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setData(response.data);
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
  //  Constants
  //----------
  const sorter = ["ascend", "descend"];
  const columns = [
    {
      title: "SN#",
      dataIndex: "sn",
      key: "sn",
      width: 60,
      sorter: (a, b) => a.sn - b.sn,
    },
    {
      title: "Invoice No",
      dataIndex: "invoice_no",
      key: "invoice_no",
      width: 250,
      sorter: (a, b) => a.invoice_no.localeCompare(b.invoice_no),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.invoice_no)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.package_name)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.amount)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.date)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim())
        );
      },
    },
    {
      title: "Package Name",
      dataIndex: "package_name",
      key: "package_name",
      width: 250,
      sorter: (a, b) => a.package_name.localeCompare(b.package_name),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 200,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 250,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ my: 8 }}>
            PURCHASE PACKAGE REPORT
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
          // onChange={(pagination) => setPagination(pagination)}
        />
      </Card>
    </>
  );
};

export default PackagePurchase;
