const fs = require('fs');

/*
 * 공공데이터 파일 출처
 * https://www.data.go.kr/data/15063424/fileData.do
 * csv 파일을 열어서 불필요 열을 지워줘야 함
*/

const input = './input/공공데이터_법정행정동.csv';
const output = './output/output.sql';

function main() {
  fs.unlink(output, (err) => {
    if (err) {
      console.error('Error: Faild to delete output file');
    }
  });
  createOutputFile();
}

// 토크나이징 / 아웃풋 파일 생성
function createOutputFile() {
  fs.writeFileSync(output, '');
  const contents = fs.readFileSync(input, 'utf-8');
  let current = '';

  contents.split(/\r?\n/).forEach(line =>  {
    const fields = line.split(',');
    let address = '';

    // !fields[3]: 삭제일자가 없는 주소들
    if (fields[0] && fields[1] && fields[2] && !fields[3]) {
      if (fields[1].length >= 6) {
        // 2번째 필드에 '청주시서원구'처럼 붙어 있는 경우 띄워주기
        fields[1] = fields[1].slice(0, 3) + ' ' + fields[1].slice(3);
        // console.log(fields[1]);
      }
      address = `${fields[0]} ${fields[1]} ${fields[2]}`;
    }

    // 중복값 건너뛰기
    if (address && address !== current) {
      current = address;
      fs.appendFileSync('./output/output.sql', `\nINSERT INTO address(address) VALUES('${current}');`)
    }
  });
}

main();