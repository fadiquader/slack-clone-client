// import React from 'react'
// import PropTypes from 'prop-types'
// import invariant from 'invariant'
// import { Modal, Button } from 'antd';
//
// class PreventTransition extends React.Component {
//     state = {
//         nextPath: null,
//         prevent: true,
//         openModal: false
//     };
//
//     static propTypes = {
//         when: PropTypes.bool,
//         message: PropTypes.oneOfType([
//             PropTypes.func,
//             PropTypes.string
//         ]).isRequired,
//         callback: PropTypes.func
//     }
//
//     static defaultProps = {
//         when: true,
//         callback: () => {}
//     }
//
//     static contextTypes = {
//         router: PropTypes.shape({
//             history: PropTypes.shape({
//                 block: PropTypes.func.isRequired
//             }).isRequired
//         }).isRequired
//     }
//     // this.unlisten = history.listen(() => {
//     //     this.setState({
//     //         match: this.computeMatch(history.location.pathname)
//     //     })
//     // })
//     makeTransition = () => {
//         this.setState({
//             prevent: false,
//             openModal: false
//         }, () => {
//             this.props.callback();
//             console.log('dasdasdasdasdasdasd');
//             this.context.router.history.push(this.state.nextPath);
//         });
//     };
//
//     enable(message) {
//         if (this.unblock) this.unblock();
//         this.unblock = this.context.router.history.block((nextLocation)=> {
//             if(this.props.when && this.state.prevent) {
//                 this.setState({ nextPath: nextLocation.pathname, openModal: true });
//             }
//             return !this.props.when || !this.state.prevent;
//         })}
//
//     disable() {
//         if (this.unblock) {
//             this.unblock();
//             this.unblock = null
//         }
//     }
//
//     componentWillMount() {
//         invariant(
//             this.context.router,
//             'You should not use <Prompt> outside a <Router>'
//         )
//
//         if (this.props.when)
//             this.enable(this.props.message)
//     }
//
//     componentWillReceiveProps(nextProps) {
//         if (nextProps.when) {
//             if (!this.props.when)
//                 this.enable(nextProps.message)
//         } else {
//             this.disable()
//         }
//     }
//
//     componentWillUnmount() {
//         this.disable()
//     }
//
//     cancelModal = () => this.setState({ nextPath: null, prevent: true, openModal: false });
//
//     render() {
//         const { openModal } = this.state;
//         return (
//             <div>
//                 {openModal && <Modal visible={this.state.openModal}
//                        onOk={() => this.makeTransition()}
//                        onCancel={this.cancelModal}
//                        width={400}
//                        maskClosable={false}
//                        footer={null}
//                        okText="Leave this page"
//                        cancelText="Stay on this page"
//                        wrapClassName="vertical-center-modal prevent-modal"
//                        title="Leave Page?">
//                     <p>{this.props.message}</p>
//                     <div className="text-right prevent-buttons">
//                         <Button onClick={this.cancelModal}>
//                             Stay on this page
//                         </Button>
//                         <Button type="primary" onClick={this.makeTransition} >
//                             Leave this page
//                         </Button>
//                     </div>
//                 </Modal>}
//             </div>
//         )
//     }
// }
//
// export default PreventTransition
