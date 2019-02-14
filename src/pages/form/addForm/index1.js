import React from 'react';
import { Form, Row, Col, Icon, Input, Select, message, Card, Button, Modal } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { requestRuleId, requestIndicatorList } from "../../action"
import { map } from 'lodash'
import { RULE } from '../../../../../constants'
import './index.less'
const { statusConfig, operatorConfig, enteringConfig } = RULE

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
};

const formItemLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
};

const formItemLayout2 = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 }
};

const formItemLayout3 = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 }
};

const Option = Select.Option
const RULENAME = "COND"
const condList = { indicator: "", operator: "", compareValue: "", dataType: "" }
let id;

class AddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleData: new Map(),
            visible: props.visible,
        }
        this.condId = 0;
        this.listId = 0;
        this.init = true;
        this.condNameLists = [];
       this.checkSubmit = true;//提交时校验条件名是否重复
    }

    componentDidMount() {
        this.initData()
    }

    initData() {//请求
        const { record, enteringScene } = this.props;
        const ruleId = (record && record.id) || '';
        this.props.requestIndicatorList({
            success: (res) => {
                if (!res.success) message.warning(res.message)
            },
            error: (err) => err
        })
        if (enteringScene === 'edit' || enteringScene === 'view') {
            this.props.requestRuleId({
                data: ruleId,
                success: (res) => {
                    if (res.success) {

                    } else {
                        message.warning(res.message)
                    }
                },
                error: (err) => err
            })
        }

    }

    initConfigData(data) {//回显数据转换
        const { ruleData } = this.state;
        const { enteringScene } = this.props;
        let vcondId = this.condId;
        let k = this.listId;
        let vcondNameLists = this.condNameLists;
        let key;
        if (this.init && enteringScene === 'add') {
            let condLists = new Map();
            vcondId++;
            key = RULENAME + vcondId
            k++
            condLists.set(k, { k, ...condList })
            ruleData.set(key, {
                key,
                condName: '',
                condLists: [...condLists.values()],
            })
            this.condId = vcondId;
            this.listId = k;
            this.init = false
        }
        if (this.init && data && enteringScene !== 'add') {
            const ruleContent = data.ruleContent;
            map(ruleContent, (item, condName) => {
                vcondNameLists.push(condName)
                let condLists = new Map();
                vcondId++
                key = RULENAME + vcondId
                map(item, (list) => {
                    k++;
                    condLists.set(k, { k, ...list })
                })
                ruleData.set(key,
                    {
                        condName, key, condLists: [...condLists.values()]
                    })
            })
            this.setState({ ruleData })
            this.init = false
        }
        this.condId = vcondId
        this.listId = k
        this.condNameLists = vcondNameLists
    }

    addCardForm() {//添加卡片
        const { ruleData } = this.state;
        let vcondId = this.condId
        let k = this.listId;
        let key;
        let condLists = new Map();
        vcondId++;
        key = RULENAME + vcondId
        k++
        condLists.set(k, { k, ...condList })
        ruleData.set(key, {
            key,
            condName: '',
            condLists: [...condLists.values()],
        })
        this.condId = vcondId;
        this.listId = k;
        this.setState({ ruleData })
    }

    deleteCardForm(key) {//删除卡片
        const { ruleData } = this.state;
        ruleData.delete(key)
        this.setState({ ruleData })
    }

    addItemForm(key) {//添加子项表单
        const { ruleData } = this.state;
        let k = this.listId;
        const oldList = ruleData.get(key).condLists;
        let condLists = new Map();
        k++
        condLists.set(k, { k, ...condList })
        ruleData.set(key, { key, condLists: [...oldList, ...condLists.values()] })
        this.listId = k
        this.setState({ ruleData })
    }

    deleteItemForm(key, k) {//删除子项
        const { ruleData } = this.state;
        const newList = ruleData.get(key).condLists.filter((path) => path.k !== k)
        ruleData.set(key, { key, condLists: newList })
        this.setState({ ruleData })
    }

    handleChangeOperator(key, path, value, option) {//修改dataType级联显示
        const { ruleData } = this.state
        let newLists = ruleData.get(key).condLists.filter((item) => item === path)
        newLists[0].dataType = option.props.dataType
        let index = ruleData.get(key).condLists.indexOf(path)
        ruleData.get(key).condLists.splice(index, 1, ...newLists)
        this.setState({ ruleData })
    }

    handleSearchCondName(condName, rule, value, callback) {//校验condName
        if (value  && this.checkSubmit&&this.condNameLists.includes(value)) {
            callback('规则名已存在!!')
        }
        callback()
    }

    deleteCondName(e) {//校验condName数组删除
        this.checkSubmit = true;//提交时校验条件名是否重复
        let value = e.target.value.replace(/\s+/g, "");
        if (value) {
            let vcondNameLists = this.condNameLists;
            let index = vcondNameLists.indexOf(value)
            vcondNameLists.splice(index, 1)
            this.condNameLists = vcondNameLists
        }
    }

    pushCondName(e) {//校验condName数组删除
        let value = e.target.value.replace(/\s+/g, "");
        if (value) {
            let vcondNameLists = this.condNameLists;
            vcondNameLists.push(value)
            this.condNameLists = vcondNameLists
        }
    }

    submit() {
        const { validateFields } = this.props.form;
        let queryConfig//提交的数据
       this.checkSubmit = false//关闭校验
        validateFields((err, values) => {
            if (err) return
            const { action, riskScave, ruleName } = values;
            queryConfig = { action, riskScave, ruleName }
            map(values[id], (item) => {//处理提交的数据
                queryConfig[item.condName] = [];
                map(item, (path) => {
                    if (item.condName !== path) {
                        queryConfig[item.condName].push(path)
                    }
                })
            })
             new Promise((resolve, reject) => {
                // 发起存储请求
                if(queryConfig){
                    resolve(true)
                }else{
                    reject(false)
                }

            }).then(() => this.props.onRef({ visible: false }))
        })
        console.log(queryConfig, "---------提交的数据")
        // debugger
    }
    
    render() {
        const { ruleData, visible } = this.state
        const { ruleId, form, indicatorList, enteringScene } = this.props
        const { getFieldDecorator } = form;
        const dataSource = (ruleId && ruleId.data) || ''
        let { ruleName, actions, status } = (enteringScene !== 'add' && dataSource) ? dataSource : ''
        id = (enteringScene !== 'add' && dataSource) ? dataSource.id : enteringScene
        const config = {
            rules: [{
                type: 'string',
                required: true,
            }]
        }
        const indicatorLists = (indicatorList && indicatorList.data) || ''
        const formItems = (
            <div>
                {map([...ruleData.values()], (item) => (
                    <Card
                        title='Condition'
                        className='card-form'
                        extra={enteringScene !== 'view' ?
                            (<Icon type="close" className="close"
                                onClick={this.deleteCardForm.bind(this, item.key)} />) : ''}>
                        <Row>
                            <Col sm={24}>
                                <Form.Item label="Condition Name" {...formItemLayout1}>
                                    {
                                        getFieldDecorator(`${id}.${item.key}.condName`, {
                                            initialValue: item.condName,
                                            rules: [{
                                                type: 'string',
                                                required: true,
                                                message: 'Condition Name is required'
                                            }, {
                                                validator: this.handleSearchCondName.bind(this, item.condName)
                                            }]
                                        })(
                                            <Input
                                                onFocus={this.deleteCondName.bind(this)}
                                                onBlur={this.pushCondName.bind(this)}
                                            />
                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                        {
                            map([...item.condLists], (path) => (
                                <Row>
                                    <Col sm={7}>
                                        <Form.Item label='Indicator' {...formItemLayout2}>
                                            {getFieldDecorator(`${id}.${item.key}.${path.k}.indicator`, {
                                                initialValue: path.indicator,
                                                rules: [{
                                                    type: 'string',
                                                    required: true,
                                                    message: 'Indicator is required'
                                                }]
                                            })(
                                                <Select
                                                    showSearch
                                                    onChange={this.handleChangeOperator.bind(this, item.key, path)}
                                                    optionFilterProp='children'
                                                >
                                                    {indicatorLists ? map(indicatorLists, (item) => <Option value={item.indicatorName} dataType={item.dataType}>{item.indicatorDesc}</Option>) : ''}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Form.Item  className="visible">
                                        {getFieldDecorator(`${id}.${item.key}.${path.k}.dataType`, {
                                            initialValue: path.dataType,
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Col sm={8}>
                                        <Form.Item label='Comparison Operator' {...formItemLayout3}>

                                            {getFieldDecorator(`${id}.${item.key}.${path.k}.operator`, {
                                                initialValue: path.operator,
                                                rules: [{
                                                    // type: 'string',
                                                    // required: true,
                                                    // message: 'Comparison Operator is required'
                                                }]
                                            })(
                                                <Select >
                                                    {map(operatorConfig[path.dataType], (item) => <Option value={item.operatorName}>{item.operatorDesc}</Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col sm={7}>
                                        <Form.Item label='value' {...formItemLayout2}>
                                            {getFieldDecorator(`${id}.${item.key}.${path.k}.compareValue`, {
                                                initialValue: path.compareValue,
                                                rules: [{
                                                    type: 'string',
                                                    required: true,
                                                    message: 'value is required'
                                                }]
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col sm={2} className="btns">
                                        {
                                            enteringScene !== 'view' ? [
                                                <span onClick={this.addItemForm.bind(this, item.key, path.k)}>+</span>,
                                                item.condLists.length > 1 ? <span onClick={this.deleteItemForm.bind(this, item.key, path.k)}>-</span> : ''
                                            ] : ''
                                        }
                                    </Col>
                                </Row>
                            ))}
                    </Card>
                ))}
            </div>)
        return (
            <Modal
                title={enteringConfig[enteringScene]}
                visible={visible}
                className='modal-wrap'
                okText='save'
                onCancel={() => this.props.onRef({ visible: false })}
                onOk={() => this.submit()}
                okButtonProps={{ disabled: enteringScene === "view" }}
            >
                <Form>
                    <Row>
                        <Col sm={8}>
                            <Form.Item {...formItemLayout} label="Rule Name">
                                {
                                    getFieldDecorator('ruleName', {
                                        initialValue: ruleName,
                                        ...config
                                    })(
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col sm={8}>
                            <Form.Item {...formItemLayout} label="Action">
                                {
                                    getFieldDecorator('action', {   
                                        initialValue: actions?actions[0]:'',
                                        ...config
                                    })(
                                        <Select >
                                            {map(statusConfig, (item) => <Option value={item.key}>{item.value}</Option>)}
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col sm={8}>
                            {
                                enteringScene !== 'add' ? <Form.Item {...formItemLayout} label="Risk Scave">
                                    {
                                        getFieldDecorator('Risk Scene', {
                                            initialValue: status,
                                            ...config
                                        })(
                                            <Select >
                                                {map(statusConfig, (item) => <Option value={item.key}>{item.value}</Option>)}
                                            </Select>
                                        )
                                    }
                                </Form.Item> : null
                            }
                        </Col>
                    </Row>
                    {this.initConfigData(dataSource)}
                    {formItems}
                    <Row>
                        <Col sm={24} className="text-right">
                            {enteringScene !== 'view' ? (
                                <Button type="primary" onClick={() => this.addCardForm()}>Add Condition</Button>
                            ) : ''}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
export default connect(
    state => ({
        ruleId: state.ruleId,
        indicatorList: state.indicatorList,
    }),
    dispatch => bindActionCreators({ requestRuleId, requestIndicatorList }, dispatch))(Form.create()(AddForm))