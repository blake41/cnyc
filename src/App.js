import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { actions, selectors } from "redux-saga-web3";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import NetworkStatus from "react-redux-saga-web3/lib/components/NetworkStatus";

import PurchaseContainer from "./containers/PurchaseContainer";
import { Logo, Shirt } from "./components";
import withLoading from "./utils/withLoading";

const StyledApp = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Courier New", Courier, serif;
`;

const StyledProduct = styled.div`
  display: flex;
  @media only screen and (max-width: 830px) {
    flex-direction: column;
  }
`;

const StyledNetworkStatus = styled(NetworkStatus)`
  position: absolute;
  top: 10px;
  right: 20px;
`;

class App extends Component {
  render() {
    const { network, accounts } = this.props;
    return (
      <StyledApp>
        <StyledNetworkStatus networkId={network} address={accounts[0]} />
        {network !== 1 ? (
          <div>Please switch to Ethereum Mainnet</div>
        ) : (
          <Fragment>
            <Logo />
            <StyledProduct>
              <Shirt />
              <PurchaseContainer />
            </StyledProduct>
          </Fragment>
        )}
      </StyledApp>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(actions.init.init()),
  getAccounts: () => dispatch(actions.accounts.getRequest())
});

export default compose(
  connect(
    state => ({
      isLoading: selectors.init.selectIsLoading(state),
      network: selectors.init.selectNetwork(state),
      accounts: selectors.init.selectAccounts(state)
    }),
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount() {
      this.props.init();
      this.props.getAccounts();
    }
  }),
  withLoading(({ accounts, isLoading }) => !accounts || isLoading)
)(App);
