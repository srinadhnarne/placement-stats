import placementModel from "../models/placements.js"

export const SixMonthController = async(req,res)=>{
    const {pgNo} = req.params;
    // const {pgLimit} = req.body;
    try {
        const SixMData = await placementModel.find({}).select('RegNo Name InternCompany Stipend').sort({RegNo:1}).limit(10).skip(10*(pgNo-1));
        res.status(200).send({
            success:true,
            SixMData
        })

    } catch (error) {
        console.log(error);
    }
}

export const FTEController = async(req,res)=>{
    const {pgNo} = req.params;
    // const {pgLimit} = req.body;
    try {
        const FTEData = await placementModel.find({}).select('RegNo Name PlacementCompany CTC').sort({RegNo:1}).limit(10).skip(10*(pgNo-1));
        res.status(200).send({
            success:true,
            FTEData
        })
    } catch (error) {
        console.log(error);
    }
}

export const AllDataController = async(req,res)=>{
    const {pgNo} = req.params;
    // const {pgLimit} = req.body;
    try {
        const AllData = await placementModel.find({}).sort({RegNo:1}).limit(10).skip(10*(pgNo-1));
        res.status(200).send({
            success:true,
            AllData
        })
    } catch (error) {
        console.log(error);
    }
}
export const cummulatedDataController = async (req,res)=>{
    try {
        const{queryType} = req.params;
        if(queryType==='Intern'){
            const data = await placementModel.find({'InternStatus':{$ne:false}}).select('Stipend')
            const count = data.length;
            
            let avg=0,DU=false;
            if(data!==null) data?.map((item)=>{if(item.Stipend!=="")avg+=Number(item.Stipend); else DU=true;});
            // console.log(data,count,avg/count);
            if(DU){
                return res.status(200).send({
                    success:true,
                    accumulatedData:[count,'NA']
                })
            }
            res.status(200).send({
                success:true,
                accumulatedData:[count,avg/count]
            })
        } else if(queryType==='FTE'){
            const data = await placementModel.find({'PlacementStatus':{$ne:false}}).select('CTC');
            const count = data.length;
            let avg=0,DU=false;
            if(data!==null) data?.forEach((item)=>{if(item.CTC!="")avg+=Number(item.CTC); else DU=true;});
            // console.log(data,count,avg/count);
            if(DU){
                return res.status(200).send({
                    success:true,
                    accumulatedData:[count,'NA']
                })
            }
            res.status(200).send({
                success:true,
                accumulatedData:[count,avg/count]
            })
        } else {
            const data = await placementModel.find({}).countDocuments({$or:[{'PlacementStatus':{$ne:false}},{'InternStatus':{$ne:false}}]});
            res.status(200).send({
                success:true,
                accumulatedData:[data,0]
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const updateDataController = async(req,res)=>{
    const {query,RegNo,Company,Amount} = req.body;
    // console.log(req.body)
    if(query==='Intern'){
        await placementModel.findOneAndUpdate({RegNo},{
        InternCompany:Company,
        Stipend:Amount,
        InternStatus:Company===""?false:true
    })}
    else {
        await placementModel.findOneAndUpdate({RegNo},{
            PlacementCompany:Company,
            CTC:Amount,
            PlacementStatus:Company===""?false:true
        })
    }
    return 
}