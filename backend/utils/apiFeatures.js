class ApiFeatures{
    constructor(query,queryStr)
    {
        this.query = query,
        this.queryStr = queryStr
    }
    search()
    {
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options : "i"
            }
        }:{}
        this.query= this.query.find({...keyword}); 
        return this;
    }
    filter()
    {
        const queryCpy = {...this.queryStr};
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach(key =>delete queryCpy[key]);

        let queryCpyStr = JSON.stringify(queryCpy);
        queryCpyStr = queryCpyStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
        this.query = this.query.find(JSON.parse(queryCpyStr));
        return this;
    }
    pagination(resultPerPage)
    {
        const curPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage* (curPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;