//----------
//  React Imports
//----------
import { useEffect, useRef, useState } from "react";

//----------
//  MUI Imports
//----------
import {
  Grid,
  Button,
  Box,
  Typography,
  Card,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CardContent,
  TableContainer,
  Backdrop,
  CircularProgress,
  Paper,
} from "@mui/material";

//----------
//  Other Libraries Import
//----------
import axios from "axios";
import { Table, Input } from "antd";
import { toast } from "react-hot-toast";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";

const ShoppingInvoice = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState(null);
  const [invoice, setInvoice] = useState([]);
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [stockistId, setStockistId] = useState(null);
  const [stockistName, setStockistName] = useState(null);
  const [searchedText, setSearchedText] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1, // Initial current page
  });

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Refs
  //----------
  const descriptionElementRef = useRef(null);

  //----------
  //  Effects
  //----------
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/invoice/my-shopping`,
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
  //  API calls
  //----------
  const viewInvoice = (inv) => {
    setInvoiceNo(inv);
    setOpen(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel/invoice/${inv}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      })
      .then((response) => {
        setOpen(false);
        setEditModalOpen(true);
        setInvoice(response.data);
        setInvoiceItems(response.data.items);
        let filter = data.filter((d) => d.invoice_no == inv);
        setStockistId(filter[0].seller_id);
        setStockistName(filter[0].seller_username);
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

  //----------
  //  Constants
  //----------
  const sorter = ["ascend", "descend"];
  const columnsInvoice = [
    {
      title: "#",
      render: (_, object, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "ITEM",
      dataIndex: "product_name",
    },
    {
      title: "UNIT COST",
      dataIndex: "price",
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
    },
    {
      title: "TOTAL",
      dataIndex: "net_price",
    },
  ];
  const columns = [
    {
      title: "SN#",
      dataIndex: "sn",
      key: "sn",
      width: 60,
      sorter: (a, b) => a.sn - b.sn,
    },
    {
      title: "Seller ID",
      dataIndex: "seller_id",
      key: "seller_id",
      width: 250,
      sorter: (a, b) => a.seller_id.localeCompare(b.seller_id),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.seller_id)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.seller_username)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.total_amount)
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
      title: "Seller Username",
      dataIndex: "seller_username",
      key: "seller_username",
      width: 250,
      sorter: (a, b) => a.seller_username.localeCompare(b.seller_username),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 200,
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 250,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "View Invoice",
      dataIndex: "invoice_no",
      key: "view_invoice",
      width: 200,
      render: (invoiceNo) => (
        <Link href="javascript:void(0)" onClick={() => viewInvoice(invoiceNo)}>
          View Invoice
        </Link>
      ),
    },
  ];

  //----------
  //  Handlers
  //----------
  const handleClose = () => {
    setEditModalOpen(false);
  };

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ my: 8 }}>
            MY VENDOR INVOICE REPORT
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
          loading={tableLoading}
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

        {/* <DataGrid rows={data} getRowId={(row) => row.sn} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight /> */}
      </Card>

      <div>
        <Dialog
          open={editModalOpen}
          onClose={handleClose}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullScreen
        >
          <DialogTitle id="scroll-dialog-title">
            PURCHASE INVOICE [{invoiceNo}]
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Grid item xs={12}></Grid>

              <Card component="div" sx={{ position: "relative", mb: 7 }}>
                <CardContent>
                  <Grid item xs={12}>
                    <Box>
                      <Typography
                        variant="div"
                        sx={{
                          fontWeight: "bold",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        PAID AMOUNT:{" "}
                        {new Intl.NumberFormat(`${localStorage.localization}`, {
                          style: "currency",
                          currency: process.env.NEXT_PUBLIC_CURRENCY,
                        }).format(invoice?.total_purchase)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container spacing={10} sx={{ mt: 5 }}>
                    <Grid item xs={6}>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <b>TO</b>: {invoice?.user?.first_name}{" "}
                        {invoice?.user?.last_name}
                      </Typography>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <b>Address</b>: {invoice?.user?.address}{" "}
                        {invoice?.user?.city} {invoice?.user?.state}{" "}
                        {invoice?.user?.country}
                      </Typography>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <b>Tel</b>: {invoice?.user?.telephone}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <b>INVOICE INFO</b>
                      </Typography>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        Invoice Number: <b>{invoice?.invoice_no}</b>
                      </Typography>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        Invoice Date:{" "}
                        <b>
                          {new Date(invoice?.invoice_date).toLocaleDateString()}
                        </b>
                      </Typography>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        Stockist Id : <b>{stockistId}</b>
                      </Typography>
                      <Typography
                        variant="div"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        Stockist Name : <b>{stockistName}</b>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Card component="div" sx={{ position: "relative", my: 7 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <TableContainer component={Paper}>
                          <Table
                            columns={columnsInvoice}
                            dataSource={invoiceItems}
                            loading={tableLoading}
                            sortDirections={sorter}
                            pagination={
                              data?.length > 10
                                ? {
                                    defaultCurrent: 1,
                                    total: invoiceItems?.length,
                                    defaultPageSize: 10,
                                    showSizeChanger: true,
                                    showTotal: (total, range) =>
                                      `Total: ${total}`,
                                    pageSizeOptions: ["10", "20", "50", "100"],
                                    locale: { items_per_page: "" },
                                  }
                                : false
                            }
                            onChange={(pagination) => setPagination(pagination)}
                          />
                        </TableContainer>
                      </Grid>
                      <Grid container spacing={10} sx={{ mt: 5 }}>
                        <Grid item xs={6}>
                          <Typography
                            variant="div"
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <b>Payment Status</b>: {invoice?.invoice_status}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="div"
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            Subtotal:{" "}
                            <b>
                              {" "}
                              {new Intl.NumberFormat(
                                `${localStorage.localization}`,
                                {
                                  style: "currency",
                                  currency: process.env.NEXT_PUBLIC_CURRENCY,
                                }
                              ).format(invoice?.subtotal)}
                            </b>
                          </Typography>
                          <Typography
                            variant="div"
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            GRAND TOTAL:{" "}
                            <b>
                              {new Intl.NumberFormat(
                                `${localStorage.localization}`,
                                {
                                  style: "currency",
                                  currency: process.env.NEXT_PUBLIC_CURRENCY,
                                }
                              ).format(invoice?.grand_total)}
                            </b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

export default ShoppingInvoice;
