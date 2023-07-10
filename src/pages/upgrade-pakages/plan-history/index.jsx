//----------
//  React imports
//----------
import { useEffect, useState } from "react";

//----------
//  MUI imports
//----------
import { CardContent, Typography,Card } from "@mui/material";

//----------
// Other Libraries imports
//----------
import axios from "axios";
import { toast } from "react-hot-toast";
import { Table, Input } from "antd";

//----------
//  Local Imports
//----------
import { useAuth } from "src/hooks/useAuth";

//----------
//  Constants
//----------
const sorter = ["ascend", "descend"];

const PlanHistory = () => {
  //----------
  //  States
  //----------
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1, // Initial current page
  });
  const [searchedText, setSearchedText] = useState("");

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel/plan/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        .then((response) => {
          setHistory(response.data);
        })
        .catch((error) => {
          if (error) {
            toast.error(
              `${error.response ? error.response.status : ""}: ${
                error.response ? error.response.data.message : error
              }`
            );
            if (error.response && error.response.status == 401) {
              auth.logout();
            }
          }
        });
    };
    loadData();
  }, []);

  //----------
  //  Constants
  //----------
  const columns = [
    {
      title: "Sr. No",
      render: (_, object, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Subscription No",
      dataIndex: "lifejacket_id",
      sorter: {
        compare: (a, b) => a.lifejacket_id.localeCompare(b.lifejacket_id),
        multiple: 2,
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.lifejacket_id)
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
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.expire_date)
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
      sorter: {
        compare: (a, b) => a.package_name.localeCompare(b.package_name),
        multiple: 2,
      },
    },
    {
      title: `Amount (${process.env.NEXT_PUBLIC_CURRENCY})`,
      dataIndex: "amount",
      sorter: {
        compare: (a, b) => a.package_name.localeCompare(b.package_name),
        multiple: 2,
      },
    },
    {
      title: "Start Date",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => a.date.localeCompare(b.date),
        multiple: 2,
      },
      render: (text, record) => new Date(record.date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "expire_date",
      sorter: {
        compare: (a, b) => a.expire_date.localeCompare(b.expire_date),
        multiple: 2,
      },
      render: (text, record) =>
        new Date(record.expire_date).toLocaleDateString(),
    },
  ];

  //----------
  //  JSX
  //----------
  return (
    <>
      <Card component="div" sx={{ position: "relative", mb: 7 }}>
        <Typography variant="h6" sx={{ p: 5 }}>
          Self Investment History
        </Typography>
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
            dataSource={history}
            loading={false}
            sortDirections={sorter}
            pagination={
              history?.length > 0
                ? {
                    defaultCurrent: 1,
                    total: history?.length,
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

        {/* <DataGrid rows={history} columns={columns} pageSize={20} rowsPerPageOptions={[10]} autoHeight /> */}
      </Card>
    </>
  );
};

export default PlanHistory;
