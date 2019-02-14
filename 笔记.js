
// 不确定字段映射
const clusterInfoConfig = [
    {
      title: 'Cluster Size',
      key: 'clusterSize',
    },
    {
      title: 'Order Amount',
      key: 'orderAmount',
    },
    ...
  ]
  const clusterInfo = json返回数据
  clusterInfoConfig.map((item) => {
    return <div>{item.title} : {clusterInfo[key]}</div>
  })

//补0  
h=(`0${h}`).slice(-2)

//简化if
// if( true ){ fn() }==> true && fn ()

//避免每次迭代数组长度
var length=arr.length;
for(let i=0;i<length;i++){}

//数组合并
// 小数组：  concat()
//大数组 ：   Array.prototype.push.apply(arr1,arr2)