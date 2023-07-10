//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
// MUI imports
//----------
import { Grid, Box, Typography, Card, CardContent } from "@mui/material";

//----------
// Other libraries import
//----------
import axios from "axios";
import { Table, Input } from "antd";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";

const WithdrawalRequest = () => {
  //----------
  //  Hooks & states
  //----------
  const auth = useAuth();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1, // Initial current page
  });
  const [searchedText, setSearchedText] = useState("");

  //----------
  //  Constants
  //----------
  const sorter = ["ascend", "descend"];
  const columns = [
    {
      title: "Sr. No",
      render: (_, object, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },

    {
      title: "Transaction Number",
      dataIndex: "transaction_number",
      sorter: {
        compare: (a, b) =>
          a.transaction_number.localeCompare(b.transaction_number),
        multiple: 2,
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.transaction_number)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.request_amount)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.total_paid_amount)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.transaction_charge)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.posted_date)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.admin_remark)
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
      title: "Request Amount",
      dataIndex: "request_amount",
      sorter: {
        compare: (a, b) => a.request_amount - b.request_amount,
        multiple: 2,
      },
    },
    {
      title: "Paid Amount",
      dataIndex: "total_paid_amount",
      sorter: {
        compare: (a, b) => a.total_paid_amount - b.total_paid_amount,
        multiple: 2,
      },
    },
    {
      title: "Transaction Charge",
      dataIndex: "transaction_charge",
      sorter: {
        compare: (a, b) => a.total_paid_amount - b.total_paid_amount,
        multiple: 2,
      },
      render: (_, object, index) => (
        <Typography>{object.transaction_charge + " " + "%   "}</Typography>
      ),
    },

    {
      title: "Request Date",
      dataIndex: "posted_date",
      sorter: {
        compare: (a, b) => a.posted_date.localeCompare(b.posted_date),
        multiple: 2,
      },
      render: (text, record) =>
        new Date(record.posted_date).toLocaleDateString(),
    },

    {
      title: "Admin Response",
      dataIndex: "admin_remark",
      sorter: {
        compare: (a, b) => a.admin_remark.localeCompare(b.admin_remark),
        multiple: 2,
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
        multiple: 2,
      },
    },
  ];

  //----------
  // Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/wallet-mgt/my-withdrawal-requests`,
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
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ my: 8 }}>
            Withdrawal Request
          </Typography>
        </Box>
      </Grid>

      <Card component="div" sx={{ position: "relative", mb: 7 }}>
        <CardContent>
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
            onChange={(pagination) => setPagination(pagination)}
          />
        </CardContent>
        {/* <DataGrid rows={data} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight /> */}
      </Card>
    </>
  );
};

export default WithdrawalRequest;
