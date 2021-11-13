import React, { useEffect, useState } from "react";
import { Button, Space, message, Row, Col, Card } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import AddDataModel from "../../components/AddDataModel/index.js";
import CSVDialog from "../../components/CSVDialog/index.js";
import SeedsTable from "../../components/SeedsTable/index.js";
import { fetchTableData } from "../../service/apiService";
import SearchForm from "../../components/SearchForm/index.js";
import { SeedReportSearchFormConfig } from "../../config";
import "./index.css";

function SeedReport(props) {
  const [dataSource, setDataSource] = useState([]);
  const [modelShow, setModelShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [refetch, setRefetch] = useState(true);
  const [paginationProps, setPaginationProps] = useState({
    pageSize: currentPageSize,
    current: currentPage,
    onChange: (current, pageSize) => {
      setCurrentPage(current);
      setPageSize(pageSize);
    }
  });
  const [searchParams, setSearchParams] = useState({});
  const [resetFilter, setResetFilter] = useState(true);

  useEffect(() => {
    setPaginationProps((p) => {
      return {
        ...p,
        current: currentPage,
        pageSize: currentPageSize,
      };
    });
  }, [currentPage, currentPageSize]);

  const AddDataOK = (data) => {
    setModelShow(false);
    setCurrentPage(1);
    setSearchParams({});
    setRefetch(true);
    setResetFilter(true);
  };

  /**
   search by conditions
  */
  const onSearch = (data) => {
    const params = {};
    Object.keys(data).forEach((key) => {
      if (data[key] || data[key] === 0) {
        params[key] = data[key];
        if (key === "age") {
          if (data[key] === "under 20") params[key] = "0-20";
          if (data[key] === "older than 81") params[key] = "81-130";
        }
      }
    });
    setSearchParams(params);
    setResetFilter(false);
    setRefetch(true);
  };

  const fetchData = () => {
    fetchTableData({
      ...searchParams,
      page: 1,
      count: 10,
    }).then((res) => {
      if (!res.data.records) {
        message.warning("There is no data from the seed report!");
        setDataSource(null);
      } else {
        setDataSource(
          res.data.records
            .sort((prev, next) => {
              return (
                new Date(next["Result Date"]).getTime() -
                new Date(prev["Result Date"]).getTime()
              );
            })
            .map((d, index) => {
              return { ...d, key: `${Date.now()}${index}` };
            })
        );
      }
    });
  };

  useEffect(() => {
    if (refetch) {
      if (resetFilter) setSearchParams({});
      setRefetch(false);
      fetchData();
    } else {
      setResetFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return (
    <div className="app">
      <Space className="table-top" style={{ marginBottom: "3%" }}>
        <Card style={{ width: "110%" }}>
          <p style={{ fontWeight: "bold" }}>
            Click below buttons to add more seeds or download seed report.
          </p>
          <Row>
            <Col>
              <CSVDialog resetFilter={setResetFilter} refetch={setRefetch} />
              <Button
                style={{
                  color: "white",
                  background: "#4287f5",
                  height: "120%",
                  width: "47%",
                  margin: "1%",
                }}
                onClick={() => setModelShow(true)}
              >
                <FileAddOutlined />
                Add New Seed
              </Button>
            </Col>
          </Row>
        </Card>
      </Space>
      <h1 className="table-title">Seeds Report</h1>
      <div>
        <SearchForm
          config={SeedReportSearchFormConfig}
          resetFilter={resetFilter}
          onSearch={onSearch}
        />
      </div>
      <br />
      <p>
        Click EMAIL_ADDRESS, MOBILE_NUM, TEST_RESULT cells to edit email, mobile
        phone number or test result.
      </p>
      <p>
        Click INCLUDE button in ACTION cell to send email or SMS invite (if
        email address is not available) to a seed to join the study.
      </p>
      <Space direction="vertical" style={{ width: "100%" }}>
        <SeedsTable
          bordered
          dataSource={dataSource}
          setRefetch={setRefetch}
          paginationProps={paginationProps}
        />
      </Space>
      <AddDataModel
        title="Add New Seed"
        modelShow={modelShow}
        onOk={(res) => AddDataOK(res)}
        onCancel={() => setModelShow(false)}
      ></AddDataModel>
    </div>
  );
}

export default SeedReport;
