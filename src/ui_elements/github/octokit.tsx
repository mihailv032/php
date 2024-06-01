import { Octokit } from '@octokit/rest';


const octokitProps:any = {}
const token = localStorage.getItem('github_token');
if(token) {
  octokitProps.auth = token;
}
console.log(octokitProps);

export const octokit = new Octokit(octokitProps);
