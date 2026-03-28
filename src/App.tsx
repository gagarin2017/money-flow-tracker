import {
  contentStyle,
  footerStyle,
  headerStyle,
  siderStyle,
} from "./components/temp/layout-styles";

import { Layout } from "antd";
import BankAccountList from "./components/BankAccounts/bank-account-list";
import { BankAccountsProvider } from "./context/bank-accounts-context";
import { TransactionsProvider } from "./context/transactions-context";
import ContentTabList from "./components/Tabs/content-tab-list";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div>
      <BankAccountsProvider>
        <TransactionsProvider>
          <Layout style={{ height: "100vh" }}>
            <Header style={headerStyle}>Money Flow Tracker</Header>
            <Layout hasSider>
              <Sider style={siderStyle} width={200}>
                <BankAccountList />
              </Sider>
              <Content style={contentStyle}>
                <ContentTabList />
              </Content>
            </Layout>
            <Footer style={footerStyle}>Footer</Footer>
          </Layout>
        </TransactionsProvider>
      </BankAccountsProvider>
    </div>
  );
}

export default App;
