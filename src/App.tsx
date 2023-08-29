import {
  contentStyle,
  footerStyle,
  headerStyle,
  siderStyle,
} from "./components/temp/layout-styles";

import { Layout } from "antd";
import BankAccountList from "./components/BankAccounts/bank-account-list";
import { Provider } from "./context/bank-accounts-context";
import ContentTabList from "./components/Tabs/content-tab-list";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <Header style={headerStyle}>Money Flow Tracker</Header>
        <Layout hasSider>
          <Provider>
            <Sider style={siderStyle} width={200}>
              <BankAccountList />
            </Sider>
            <Content style={contentStyle}>
              <ContentTabList />
            </Content>
          </Provider>
        </Layout>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
