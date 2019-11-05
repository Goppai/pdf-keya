const { search } = window.location;


const fromPreviewMatchResult = search.match(/from=([^&?#]+)&?#?/);


const backUrl = fromPreviewMatchResult && decodeURIComponent(fromPreviewMatchResult[1]);


const getBackUrl = () => backUrl;

export { getBackUrl };
