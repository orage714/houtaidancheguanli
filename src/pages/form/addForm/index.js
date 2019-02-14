import React from 'react';
import { Form, Row, Col, Icon, Input, Select, Card, Button, Modal } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { map } from "lodash";
import './index.less'

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

const statusConfig = [
    { key: 'NEW', value: '草稿' },
    { key: 'WAITING_AUDIT', value: '待审核' },
    { key: 'RUNNING', value: '正式运行' },
]

const operatorConfig = { 
    Number: [
        {
            operatorName: 'numberGt',
            operatorDesc: '>'
        }, {
            operatorName: 'numberLt',
            operatorDesc: '<'
        }, {
            operatorName: 'numberGe',
            operatorDesc: '>='
        }, {
            operatorName: 'numberLe',
            operatorDesc: '<='
        }, {
            operatorName: 'numberEquals',
            operatorDesc: '='
        }
    ],
    String:[
        {
            operatorName: 'equals',
            operatorDesc: 'equals'
        },
        {
            operatorName: 'notEquals',
            operatorDesc: 'notEquals'
        },
    ]

}

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

    initConfigData(data) {//回显数据转换
        const { ruleData } = this.state;
        let vcondId = this.condId;
        let k = this.listId;
        let vcondNameLists = this.condNameLists;
        let key;
        if (this.init) {
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
        if (this.init && data) {
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
        const { form } = this.props
        const { getFieldDecorator } = form;
       const dataSource={
        id: 27,
        gmtCreate: "Margaret Johnson",
        gmtModified: "xx",
        ruleName: "David Thomas",
        ruleIUUid: "xx",
        ruleDesc: "Donald Thomas",
        creator: "xx",
        modifier: "xx",
        actions: [
        "actions",
        "jsh"
        ],
        status: "xx",
        lastStatus: "xx",
        operation: "xx",
        submitTime: "xx",
        ruleContent: {
       'cond-1': [
        {
        indicator: "indicatorName1",
        operator: "equals",
        compareValue: "1",
        dataType: "String"
        }
        ],
        'cond-2': [
        {
        indicator: "indicatorName",
        operator: "numberLt",
        compareValue: "2",
        dataType: "Number"
        },
        {
        indicator: "indicatorName",
        operator: "numberGt",
        compareValue: "3",
        dataType: "Number"
        },
        {
        indicator: "indicatorName1",
        operator: "numberGt",
        compareValue: "4",
        dataType: "Number"
        }
        ]
        }
        }
        const indicatorLists = [
            {
            id: 32,
            gmtCreate: "Brian Gonzalez",
            gmtModified: "xx",
            indicatorName: "Michael Thompson",
            indicatorDesc: "Jose Johnson",
            creator: "xx",
            dataType: "String"
            },
            {
            id: 32,
            gmtCreate: "Melissa Hernandez",
            gmtModified: "xx",
            indicatorName: "Nancy Thomas",
            indicatorDesc: "Ruth Martin",
            creator: "xx",
            dataType: "Number"
            },
            {
            id: 32,
            gmtCreate: "Anthony Young",
            gmtModified: "xx",
            indicatorName: "Barbara Anderson",
            indicatorDesc: "Anthony White",
            creator: "xx",
            dataType: "Number"
            }
            ]
        let { ruleName, actions, status } = dataSource
        const config = {
            rules: [{
                type: 'string',
                required: true,
            }]
        }
      
        const formItems = (
            <div>
                {map([...ruleData.values()], (item) => (
                    <Card
                        title='Condition'
                        className='card-form'
                        extra={
                        <Icon
                         type="close"
                         className="close"
                         onClick={this.deleteCardForm.bind(this, item.key)} />
                         }>
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
                                                initialValue: path.operator
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
                                          [  
                                             <span onClick={this.addItemForm.bind(this, item.key, path.k)}>+</span>,
                                            item.condLists.length > 1 ? <span onClick={this.deleteItemForm.bind(this, item.key, path.k)}>-</span> : ''
                                          ]
                                        }
                                    </Col>
                                </Row>
                            ))}
                    </Card>
                ))}
            </div>)
        return [ 
            <Modal
                title='添加表单'
                visible={visible}
                className='modal-wrap'
                okText='save'
                onCancel={()=>this.setState({visible : false })}
                onOk={() => this.submit()}
                // okButtonProps={{ disabled: enteringScene === "view" }}
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
                                <Form.Item {...formItemLayout} label="Risk Scave">
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
                                </Form.Item>
                            }
                        </Col>
                    </Row>
                    {this.initConfigData(dataSource)}
                    {formItems}
                    <Row>
                        <Col sm={24} className="text-right">
                                <Button type="primary" onClick={() => this.addCardForm()}>Add Condition</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>,
            <Button type="primary" onClick={()=>this.setState({visible:true})}>表单添加DEMO</Button>
        ]
    }
}
export default Form.create()(AddForm)