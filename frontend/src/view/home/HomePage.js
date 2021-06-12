import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
//import { i18n } from 'i18n';
//import {twoColumnsResponsiveProps, threeColumnsResponsiveProps} from 'view/shared/styles/ResponsiveProps';
import { /*Row, Col,*/ Card} from 'antd';
//import HomeBarChart from 'view/home/HomeBarChart';
//import HomeDoughnutChart from 'view/home/HomeDoughnutChart';
//import HomeRadarChart from 'view/home/HomeRadarChart';
//import HomeMixChartTwo from 'view/home/HomeMixChartTwo';
//import HomeMixChartOne from 'view/home/HomeMixChartOne';
//import HomeHorizontalBarChart from 'view/home/HomeHorizontalBarChart';
//import HomePolarChart from 'view/home/HomePolarChart';
//import HomeLineChart from 'view/home/HomeLineChart';
import HomeDummyGraph from 'view/home/HomeDummyGraph';
import OverviewGraphPage from "../overview/OverviewGraphPage";

class HomePage extends PureComponent {
  render() {
    return (
      <React.Fragment>
        {/*
        <Row gutter={24}>
          <Col {...threeColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomeDoughnutChart />
            </Card>
          </Col>

          <Col {...threeColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomeMixChartTwo />
            </Card>
          </Col>

          <Col {...threeColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomeBarChart />
            </Card>
          </Col>

          <Col {...twoColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomeMixChartOne />
            </Card>
          </Col>

          <Col {...twoColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomePolarChart />
            </Card>
          </Col>

          <Col {...threeColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomeHorizontalBarChart />
            </Card>
          </Col>

          <Col {...threeColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomeLineChart />
            </Card>
          </Col>

          <Col {...threeColumnsResponsiveProps}>
            <Card bodyStyle={{ padding: 8 }}>
              <HomeRadarChart />
            </Card>
          </Col>
        </Row>
        <p
          style={{
            width: '100%',
            textAlign: 'center',
            color: 'grey',
          }}
        >
          {i18n('home.message')}
        </p>
*/}
        <Card bodyStyle={{padding: 8}}>
          <HomeDummyGraph/>
        </Card>

        <OverviewGraphPage/>
      </React.Fragment>
    );
  }
}

export default connect(null)(HomePage);
