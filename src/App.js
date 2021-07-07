import './App.css';
import { ConfigProvider ,Button} from 'zarm';
import enUS from 'zarm/lib/config-provider/locale/en_US';
import 'zarm/dist/zarm.css';

function App() {
  return (
    <ConfigProvider locale={enUS} primaryColor="#1890ff">
      <div style={{ width: 400, margin: '100px auto' }}>
        <Button theme="primary">Hello World!</Button>
      </div>
    </ConfigProvider>
  );
}

export default App;
