import {
  headerStyle,
  siderStyle,
  contentStyle,
  footerStyle,
} from "./components/temp/layout-styles";

import BankAccountList from "./components/BankAccounts/bank-account-list";
import { Button, Layout } from "antd";
import { Provider } from "./context/bank-accounts-context";
import { useContext, useEffect } from "react";

import BankAccountsContext from "./context/bank-accounts-context";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <Header style={headerStyle}>Money Flow Tracker</Header>
        <Layout hasSider>
          <Sider style={siderStyle} width={200}>
            <Provider>
              <BankAccountList />
            </Provider>
          </Sider>
          <Content style={contentStyle}>Content</Content>
        </Layout>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
