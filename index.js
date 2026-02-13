const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

class hac {
    constructor() {
        const jar = new CookieJar();
        this.client = wrapper(axios.create({
            baseURL: 'https://accesscenter.roundrockisd.org/HomeAccess/',
            jar,
            withCredentials: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }));
    }

    async login(username, password) {
        const loginPage = await this.client.get('Account/LogOn?ReturnUrl=%2fhomeaccess');
        const $ = cheerio.load(loginPage.data);
        
        const token = $('input[name="__RequestVerificationToken"]').val();

        if (!token) {
            throw new Error("Could not find RequestVerificationToken. The site layout might have changed.");
        }

        const payload = qs.stringify({
            '__RequestVerificationToken': token,
            'SCKTY00328510CustomEnabled': 'False',
            'SCKTY00436568CustomEnabled': 'False',
            'Database': '10',
            'VerificationOption': 'UsernamePassword',
            'LogOnDetails.UserName': username,
            'tempUN': '',
            'tempPW': password, 
            'LogOnDetails.Password': password
        }, { format: 'RFC1738' });

        const response = await this.client.post('Account/LogOn?ReturnUrl=%2fhomeaccess', payload, {
            headers: {
                'Referer': 'https://accesscenter.roundrockisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fhomeaccess',
                'Origin': 'https://accesscenter.roundrockisd.org'
            }
        });

        if (response.data.includes('LogOnDetails.Password')) {
            throw new Error('Login failed: Invalid credentials.');
        }

        return true;
    }

    async getGrades() {
        const { data: html } = await this.client.get('Content/Student/Assignments.aspx');
        const $ = cheerio.load(html);
        const courses = [];

        $('.AssignmentClass').each((i, element) => {
        const $el = $(element);
        let rawTitle = $el.find('.sg-header-heading').text().trim();
        let cleanTitle = rawTitle.replace(/\s\s+/g, ' ');
        let courseName = cleanTitle.split(' AVG')[0].trim();
        let averageText = $el.find('.sg-header-heading.sg-right').text().trim();
        let average = parseFloat(averageText.replace(/[^\d.]/g, ''));

        if (courseName) {
            courses.push({
                courseName,
                average: isNaN(average) ? null : average
            });
        }
    });

        return courses;
    }
}

module.exports = hac;