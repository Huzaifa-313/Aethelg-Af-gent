'''
Author: HDJ
StartDate: please fill in
LastEditTime: 2025-01-02 16:34:50
FilePath: \pythond:\LocalUsers\Goodnameisfordoggy-Gitee\JD-Automated-Tools\JD-PersDataExporter\webUI.py
Description: 

				*		写字楼里写字间，写字间里程序员；
				*		程序人员写程序，又拿程序换酒钱。
				*		酒醒只在网上坐，酒醉还来网下眠；
				*		酒醉酒醒日复日，网上网下年复年。
				*		但愿老死电脑间，不愿鞠躬老板前；
				*		奔驰宝马贵者趣，公交自行程序员。
				*		别人笑我忒疯癫，我笑自己命太贱；
				*		不见满街漂亮妹，哪个归得程序员？    
Copyright (c) 2024-2025 by HDJ, All Rights Reserved. 
'''

import os
import copy
import socket
import asyncio
import aiofiles
import argparse
import gradio as gr
import pandas as pd


from src.data import PerOrderInfoSlim
from src.LoginManager import LoginManager
from src.storage import dataStorageToExcel
from src.Exporter import JDOrderDataExporter
from src.dataPortector import OrderExportConfig
from static.theme import PremiumBox, GorgeousBlack
from src import OUTPUT_DIR

# 确保目录存在
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    
class WebUI():
    def __init__(self) -> None:
        self.config: OrderExportConfig = OrderExportConfig().load_from_json() # 读取储存的配置

    def construct(self):
        with gr.Blocks(title="JD-OrderDataExporter", theme=PremiumBox(), fill_height=True) as demo:
            gr.Markdown("# JD-Order-Data-Exporter")
            with gr.Row():
                gr.Markdown(
                    """
                    <div style="display: flex; align-items: center;">
                        <a href="https://github.com/Goodnameisfordoggy/JD-PersOrderExporter" style="margin-right: 10px;">
                            <img src="https://img.shields.io/badge/🚀-Github-gree" alt="Github Badge">
                        </a>
                        <a href="https://gitee.com/goodnameisfordoggy/jd-pers-order-exporter">
                            <img src="https://img.shields.io/badge/🚀-Gitee-red" alt="Gitee Badge">
                        </a>
                    </div>
                    """
                )
            with gr.Tabs():
                with gr.Tab(label="账号管理(Account Management)"):
                    with gr.Column():
                        nick_name_list = ["登录新的账号"] + [account["nick_name"] for account in self.config.jd_accounts_info]
                        self.select_account_dropdown = gr.Dropdown(value=nick_name_list[0], choices=nick_name_list, type="index", label="选择账号", info="Select your owned account")
                    with gr.Tabs():
                        with gr.Tab(label="当前账号信息", visible=False) as self.account_info_tab:
                            with gr.Column():
                                self.user_pic_image = gr.Image(
                                    height=150, width=150, 
                                    label="头像",
                                    placeholder="Current Account Avatar",
                                    show_download_button=False,
                                    show_fullscreen_button=False,
                                    interactive=False
                                )
                                with gr.Row():
                                    self.user_name_textbox = gr.Textbox(label="账号名(不可更改)", info="Account Name(inalterable)")
                                    self.sheet_name_textbox = gr.Textbox(label="账号数据对应的Excel表名", info="Account Data Sheet Name")
                                    self.cookies_path_textbox = gr.Textbox(label="账号Cookies存储位置", info="Cookies Path")
                    self.btn_new_account = gr.Button("登录新账号(New Account)", variant="primary")
                    
                with gr.Tab(label="数据获取设置(Data fetch Settings)"):
                    with gr.Column():
                        self.data_retrieval_mode_dropdown = gr.Dropdown(
                            label="数据获取模式",
                            info="Data Retrieval Mode (精简模式仅含：订单编号，父订单编号，订单店铺名称，商品编号，商品名称，商品数量，实付金额，订单返豆，下单时间，订单状态，收货人姓名，收货地址，联系方式)",
                            choices= ["精简", "详细"], 
                            value=self.config.data_retrieval_mode or "详细",
                            interactive=True,
                        )
                        self.date_range_dropdown = gr.Dropdown(
                            label="日期跨度",
                            info="Date Range",
                            choices= ["近三个月订单", "今年内订单", "2024年订单", "2023年订单", "2022年订单", "2021年订单", "2020年订单", "2019年订单", "2018年订单", "2017年订单", "2016年订单", "2015年订单", "2014年订单", "2014年以前订单"], 
                            value=self.config.date_search or "近三个月订单",
                            interactive=True,
                        )
                        self.status_search_dropdown = gr.Dropdown(
                            label="订单状态",
                            info="Order Status",
                            choices= ["全部状态", "等待付款", "等待收货", "已完成", "已取消"], 
                            value=self.config.status_search or "已完成",
                            interactive=True,
                        )
                        self.high_search_dropdown = gr.Dropdown(
                            label="高级筛选",
                            info="High Search",
                            choices= ["全部类型", "实物商品"],
                            value=self.config.high_search or "全部类型",
                            interactive=True,
                        )
                        self.btn_export = gr.Button("Start exporting(开始导出)", variant="primary")
                with gr.Tab(label="数据导出配置(Data Storage Settings)"):
                    with gr.Tab(label="数据(Data)"):
                        with gr.Column():
                            self.headers_dropdown = gr.Dropdown(
                                    label="表头",
                                    info="Headers",
                                    choices= ["订单编号", "父订单编号", "店铺名称", "商品编号", "商品名称", "商品数量", "实付金额", "订单返豆", "下单时间", "订单状态", "收货人姓名", "收货地址", "收货人电话", "物流公司", "快递单号", "商品总价", "订单用豆"], 
                                    value=self.config.headers or ["订单编号", "父订单编号", "店铺名称", "商品名称", "商品数量", "实付金额", "订单返豆", "订单用豆", "下单时间", "订单状态", "快递单号"],
                                    interactive=True,
                                    multiselect=True
                            )
                            self.btn_change_preview_headers = gr.Button("更新预览视图(Update preview view)", visible=False)
                            with gr.Row():
                                gr.Markdown("数据输出时的脱敏(覆盖)强度 | Intensity of desensitization (coverage) at data output")
                            with gr.Row():
                                # 滑块组件
                                self.order_id_slider = gr.Number(label="订单号", info="Order ID", minimum=0, maximum=2, step=1, value=0, interactive=False)
                                self.consignee_name_slider = gr.Number(label="收件人姓名", info="Consignee Name", minimum=0, maximum=2, step=1, value=2, interactive=True)
                                self.consignee_address_slider = gr.Number(label="收货地址", info="Consignee Address", minimum=0, maximum=2, step=1, value=2, interactive=True)
                                self.consignee_phone_number_slider = gr.Number(label="联系方式", info="Consignee Phone Number", minimum=1, maximum=2, step=1, value=2, interactive=True)
                    with gr.Tab(label="导出到Excel"):
                        with gr.Row():
                            with gr.Column():
                                self.excel_file_path_input = gr.File(label="向已有Excel文件追加", file_types=['.xlsx', '.xlsm', '.xltx', '.xltm'])
                                self.excel_file_name_input = gr.Textbox(label="新建文件", info="New File Name", placeholder="please input output file path(name) or we will use defult one...", interactive=True)
                            with gr.Column():
                                gr.Markdown("#### 使用追加模式时，请保持表头一致！")
                                with gr.Row():
                                    self.select_sheet_dropdown = gr.Dropdown(choices=["等待上传Excel文件"], label="当前Excel中存在的表", info="Sheet name owned")
                                    self.sheet_name_textbox2 = gr.Textbox(label="导出时使用的表名", info="Sheet name", interactive=True)
                                
                                self.btn_storage_to_excel = gr.Button("储存数据(storage)", variant="primary")
                                self.file_download_excel = gr.File(label="请下载文件", visible=False, interactive=False)
                        with gr.Accordion("列宽调节(Col width adjust)", open=False):
                            with gr.Row():
                                self.col_order_id_width =  gr.Slider(label="订单编号", info="Order Id", minimum=5, maximum=120, step=1, value=14, interactive=True)
                                self.col_parent_order_id_width =  gr.Slider(label="父订单编号", info="Parent Order Id", minimum=5, maximum=120, step=1, value=14, interactive=True)
                                self.col_order_shop_name_width =  gr.Slider(label="店铺名称", info="Order Shop Name", minimum=5, maximum=120, step=1, value=20, interactive=True)
                                self.col_actual_payment_amount_width =  gr.Slider(label="实付金额", info="Actual Payment Amount", minimum=5, maximum=120, step=1, value=13, interactive=True)
                            with gr.Row():
                                self.col_product_id_width =  gr.Slider(label="商品编号",  info="Product Id",minimum=5, maximum=120, step=1, value=20, interactive=True)
                                self.col_product_name_width =  gr.Slider(label="商品名称", info="Product Name", minimum=5, maximum=120, step=1, value=39, interactive=True)
                                self.col_goods_number_width =  gr.Slider(label="商品数量", info="Goods Number", minimum=5, maximum=120, step=1, value=8, interactive=True)
                                self.col_product_total_price_width =  gr.Slider(label="商品总价", info="Product Total Price", minimum=5, maximum=120, step=1, value=13, interactive=True)
                            with gr.Row():
                                self.col_order_time_width =  gr.Slider(label="下单时间", info="Order Time", minimum=5, maximum=120, step=1, value=25, interactive=True)
                                self.col_order_status_width =  gr.Slider(label="订单状态", info="Order Status", minimum=5, maximum=120, step=1, value=10, interactive=True)
                                self.col_jingdou_increment_width =  gr.Slider(label="订单返豆", info="Jingdou Increment", minimum=5, maximum=120, step=1, value=8, interactive=True)
                                self.col_jingdou_decrement_width =  gr.Slider(label="订单用豆", info="Jingdou Decrement", minimum=5, maximum=120, step=1, value=8, interactive=True)
                            with gr.Row():
                                self.col_consignee_name_width =  gr.Slider(label="收货人姓名", info="Consignee Name", minimum=5, maximum=120, step=1, value=10, interactive=True)
                                self.col_consignee_address_width =  gr.Slider(label="收货地址", info="Consignee Address", minimum=5, maximum=120, step=1, value=40, interactive=True)
                                self.col_consignee_phone_number_width =  gr.Slider(label="联系方式", info="Consignee Phone Number", minimum=5, maximum=120, step=1, value=12, interactive=True)
                                self.col_courier_services_company_width =  gr.Slider(label="物流公司", info="Courier Services Company", minimum=5, maximum=120, step=1, value=10, interactive=True)
                                self.col_courier_number_width =  gr.Slider(label="快递单号", info="Courier Number", minimum=5, maximum=120, step=1, value=18, interactive=True)
            with gr.Column():
                self.frame_data_preview = gr.DataFrame(visible=False)
            
            self.connect()
        return demo

    def connect(self):
        """
        绑定各个组件的事件处理
        """
        self.select_account_dropdown.change(
            self.handle_select_account_dropdown_change, 
            inputs=self.select_account_dropdown, 
            outputs=[
                self.btn_new_account,
                self.user_pic_image,
                self.user_name_textbox, 
                self.sheet_name_textbox, 
                self.cookies_path_textbox, 
                self.sheet_name_textbox2,
                self.account_info_tab
            ])
        self.btn_new_account.click(self.new_account, inputs=[], outputs=[self.select_account_dropdown])
        self.data_retrieval_mode_dropdown.change(self.handle_data_retrieval_mode_change, inputs=self.data_retrieval_mode_dropdown)
        self.date_range_dropdown.change(self.handle_date_range_change, inputs=self.date_range_dropdown)
        self.status_search_dropdown.change(self.handle_status_search_change, inputs=self.status_search_dropdown)
        self.high_search_dropdown.change(self.handle_high_search_change, inputs=self.high_search_dropdown)
        self.headers_dropdown.change(self.handle_header_change, inputs=self.headers_dropdown)
        # 数据脱敏滑块组
        self.desensitization_sliders = {
            "order_id": self.order_id_slider,
            "consignee_name": self.consignee_name_slider,
            "consignee_address": self.consignee_address_slider,
            "consignee_phone_number": self.consignee_phone_number_slider
        }
        for slider_name, slider in self.desensitization_sliders.items():
            slider.change(
                lambda new_value, slider_name=slider_name: self.handle_desensitization_slider_change(new_value, slider_name),
                inputs=[slider],
                outputs=[]
            )
        self.select_sheet_dropdown.change(self.handle_select_sheet_dropdown_change, inputs=[self.select_sheet_dropdown], outputs=[self.sheet_name_textbox2])
        self.excel_file_path_input.change(
            self.handle_excel_file_path_input_change, 
            inputs=[self.excel_file_path_input],
            outputs=[self.select_sheet_dropdown]
        )
        self.sheet_name_textbox.change(self.handle_sheet_name_textbox_change, inputs=[self.sheet_name_textbox])
        self.sheet_name_textbox2.change(self.handle_sheet_name_textbox_change, inputs=[self.sheet_name_textbox2])
        # Excel列宽设置滑块组
        self.excel_col_width_sliders = {
            "order_id": self.col_order_id_width,
            "parent_order_id": self.col_parent_order_id_width,
            "order_shop_name": self.col_order_shop_name_width,
            "actual_payment_amount": self.col_actual_payment_amount_width,
            "product_id": self.col_product_id_width,
            "product_name": self.col_product_name_width,
            "goods_number": self.col_goods_number_width,
            "product_total_price": self.col_product_total_price_width,
            "order_time": self.col_order_time_width,
            "order_status": self.col_order_status_width,
            "jingdou_increment": self.col_jingdou_increment_width,
            "jingdou_decrement": self.col_jingdou_decrement_width,
            "consignee_name": self.col_consignee_name_width,
            "consignee_address": self.col_consignee_address_width,
            "consignee_phone_number": self.col_consignee_phone_number_width,
            "courier_services_company": self.col_courier_services_company_width,
            "courier_number": self.col_courier_number_width
        }
        for slider_name, slider in self.excel_col_width_sliders.items():
            slider.change(
                lambda new_value, slider_name=slider_name: self.handle_desensitization_slider_change(new_value, slider_name),
                inputs=[slider],
                outputs=[]
            )
        self.btn_export.click(
            self.export, 
            inputs=[],
            outputs=[
                self.frame_data_preview,
                self.frame_data_preview,
                self.btn_change_preview_headers
            ]
        )
        self.btn_change_preview_headers.click(
            self.change_preview_headers,
            inputs=[],
            outputs=[self.frame_data_preview]
        )
        self.btn_storage_to_excel.click(
            self.storage_to_excel, 
            inputs=[self.excel_file_path_input, self.excel_file_name_input], 
            outputs=[self.file_download_excel, self.btn_storage_to_excel]
        )
        
    def handle_select_account_dropdown_change(self, index):
        """
        处理 jd 账号切换操作
        Returns:
            list:
            - btn_new_account (visible)
            - user_pic_image (value)
            - user_name (value)
            - sheet_name (value)
            - cookies_path (value)
            - sheet_name (value)
            - account_info_tab (visible)
        """
        # index为0，视为使用未记录的新账号登录
        if index == 0: 
            return [
                gr.update(visible=True), 
                gr.update(), 
                gr.update(), 
                gr.update(), 
                gr.update(), 
                gr.update(),
                gr.update(visible=False)
            ]
        else:
            account_index = index - 1
            user_name = self.config.jd_accounts_info[account_index]["user_name"]
            sheet_name = self.config.jd_accounts_info[account_index]["sheet_name"]
            cookies_path = self.config.jd_accounts_info[account_index]["cookies_path"]
            self.config.jd_account_last_used = account_index
            return [
                gr.update(visible=False),
                gr.update(value=self.config.jd_accounts_info[self.config.jd_account_last_used]["user_picture_url"]),
                gr.update(value=user_name), 
                gr.update(value=sheet_name), 
                gr.update(value=cookies_path), 
                gr.update(value=sheet_name),
                gr.update(visible=True)
            ]
    
    def handle_data_retrieval_mode_change(self, new_value):
        self.config.data_retrieval_mode = new_value

    def handle_date_range_change(self, new_value):
        self.config.date_search = new_value

    def handle_status_search_change(self, new_value):
        self.config.status_search = new_value

    def handle_high_search_change(self, new_value):
        self.config.high_search = new_value
    
    def handle_header_change(self, new_value):
        self.config.headers = new_value
    
    def handle_desensitization_slider_change(self, new_value, slider_name):
        self.config.masking_intensity[slider_name] = new_value  # 动态保存值
    
    def handle_excel_file_path_input_change(self, uploaded_file):
        sheets_name = []
        if uploaded_file:
            sheets_name = dataStorageToExcel.ExcelStorage(file_name=uploaded_file.name).get_all_sheets_name()
        return gr.update(choices=sheets_name)

    def handle_select_sheet_dropdown_change(self, sheet_name):
        return gr.update(value=f"{sheet_name}")

    def handle_sheet_name_textbox_change(self, sheet_name):
        self.config.jd_accounts_info[self.config.jd_account_last_used]["sheet_name"] = sheet_name
    
    def handle_excel_col_width_slider_change(self, new_value, slider_name):
        self.config.excel_storage_settings["headers_settings"][slider_name]["width"] = new_value
    
    def new_account(self):
        """
        登录新账号，按钮绑定操作

        Returns:
            - select_account_dropdown(value, choices)
        """
        loginManager = LoginManager(headless=False, cookie_file=None)
        account_info = loginManager.login_new_account()
        # 储存账号信息
        if self.config.add_account_info(account_info):
            self.config.save_to_json()
            nick_name_list = ["登录新的账号"] + [account["nick_name"] for account in self.config.jd_accounts_info]
            return gr.update(value=nick_name_list[-1], choices=nick_name_list)
        else:
            gr.Warning("当前账号已存在，已更新对应 cookies 文件！")
            return gr.update(value=self.select_account_dropdown.choices[0][0])
            

    async def export(self):
        """
        导出数据，按钮绑定操作
        Returns:
            list:
            - frame_data_preview (DataFrame) 
            - frame_data_preview (visible)
            - btn_change_preview_headers (visible, variant)
        """
        self.config.save_to_json() # 保存本次配置
        self.orderInfo_list: list[dict] = await asyncio.to_thread(self.fetch_data)
        self.temp_orderInfo_list = copy.deepcopy(self.orderInfo_list) # 创建临时副本
        df = pd.DataFrame(self.temp_orderInfo_list)
        frame_preview = df[self.config.headers]
        return [frame_preview, gr.update(visible=True), gr.update(visible=True, variant="primary")]

    def fetch_data(self):
        """
        获取数据
        """
        loginManager = LoginManager(
            headless=False, 
            cookie_file=self.config.jd_accounts_info[self.config.jd_account_last_used]["cookies_path"]
        ).login_with_cookies()
        exporter = JDOrderDataExporter(self.config, loginManager.page)
        exporter.exec_()
        return exporter.get_order_info_list()
        # return [
        #     {"订单用豆": 10, "快递单号": "123456789", "订单编号": "100001", "父订单编号": "900001", "店铺名称": "店铺A", "商品名称": "商品1", "商品数量": 2, "实付金额": 50.0, "订单返豆": 10, "下单时间": "2024-11-23 15:30", "订单状态": "已完成"},
        #     {"订单用豆": 10, "快递单号": "123456789", "订单编号": "100002", "父订单编号": "900001", "店铺名称": "店铺A", "商品名称": "商品2", "商品数量": 1, "实付金额": 30.0, "订单返豆": 5, "下单时间": "2024-11-23 15:31", "订单状态": "已完成"},
        #     {"订单用豆": 10, "快递单号": "123456789", "订单编号": "100003", "父订单编号": "900002", "店铺名称": "店铺B", "商品名称": "商品3", "商品数量": 3, "实付金额": 75.0, "订单返豆": 15, "下单时间": "2024-11-24 12:00", "订单状态": "待发货"},
        #     {"订单用豆": 10, "快递单号": "123456789", "订单编号": "100004", "父订单编号": "900003", "店铺名称": "店铺C", "商品名称": "商品4", "商品数量": 1, "实付金额": 20.0, "订单返豆": 2, "下单时间": "2024-11-24 13:45", "订单状态": "已取消"}
        # ]
    
    async def change_preview_headers(self):
        """
        更新预览视图，按钮绑定操作
        Returns:
            list:
            - frame_data_preview (DataFrame)
        """
        self.temp_orderInfo_list = copy.deepcopy(self.orderInfo_list) # 更新副本
        for orderInfo in self.temp_orderInfo_list:
            # 脱敏强度切换
            if "收货人姓名" in self.config.headers:
                orderInfo["收货人姓名"] = PerOrderInfoSlim.mask_consignee_name(orderInfo["收货人姓名"], self.config.masking_intensity["consignee_name"])
            if "收货地址" in self.config.headers:
                orderInfo["收货地址"] = PerOrderInfoSlim.mask_consignee_address(orderInfo["收货地址"], self.config.masking_intensity["consignee_address"])
            if "收货人电话" in self.config.headers:
                orderInfo["收货人电话"] = PerOrderInfoSlim.mask_consignee_phone_number(orderInfo["收货人电话"], self.config.masking_intensity["consignee_phone_number"])
        
        try:
            df = pd.DataFrame(self.temp_orderInfo_list)
            frame_preview = df[self.config.headers]
            return gr.update(value=frame_preview)
        except KeyError as err:
            import re
            err_key = re.search(r"\'(.*?)\'", str(err)).group(1)
            gr.Warning(f"当前模式==“{self.config.data_retrieval_mode}”==存在不可用表头==“{err_key}”！")
            

    async def storage_to_excel(self, uploaded_file, input_name):
        """
        存储数据到 Excel，按钮绑定操作
        Returns:
            list:
            - file_download_excel (value, visible)
            - btn_storage_to_excel (value, variant)
        """
        self.config.save_to_json() # 保存本次配置
        if uploaded_file:
            # 追加模式
            file_name = os.path.basename(uploaded_file.name)
            save_path = os.path.join(OUTPUT_DIR, file_name)

            # 从 gradio 缓存目录中移动到指定目录
            async with aiofiles.open(uploaded_file.name, 'rb') as src:
                async with aiofiles.open(save_path, 'wb') as dest:
                    await dest.write(await src.read())
            try:
                excelStorage = dataStorageToExcel.ExcelStorage(
                    data=self.temp_orderInfo_list, 
                    header_needed=self.config.headers, 
                    file_name=save_path, 
                    sheet_name=self.config.jd_accounts_info[self.config.jd_account_last_used]["sheet_name"]
                )
                excelStorage.save()
                return [
                    gr.update(value=save_path, visible=True),
                    gr.update(value="✔️", variant="secondary")
                ]
            except Exception as err:
                gr.Warning("文件格式不符合追加要求，请新建文件储存！")
                return 
        else: 
            # 新建模式
            if not input_name:
                input_name = "JD_order_info"
            if not input_name.endswith(('.xlsx', '.xlsm', '.xltx', '.xltm')):
                input_name += '.xlsx'

            save_path = os.path.join(OUTPUT_DIR, input_name)
            excelStorage = dataStorageToExcel.ExcelStorage(
                    data=self.temp_orderInfo_list, 
                    header_needed=self.config.headers, 
                    file_name=save_path, 
                    sheet_name=self.config.jd_accounts_info[self.config.jd_account_last_used]["sheet_name"]
            )
            excelStorage.save()
            return [
                gr.update(value=save_path, visible=True),
                gr.update(value="✔️", variant="secondary")
            ]

if __name__ == "__main__":
    async def main():
        webui = WebUI()
        demo = webui.construct()

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', 0))  # 系统会自动分配一个可用端口
            dynamic_port = s.getsockname()[1]
                
        parser = argparse.ArgumentParser(description='JD-PersOrderExporter demo Launch')
        parser.add_argument('--server_name', type=str, default='127.0.0.1', help='Server name')
        parser.add_argument('--server_port', type=int, default=dynamic_port, help='Server port')
        args = parser.parse_args()

        # 异步启动 Gradio 应用
        await asyncio.to_thread(demo.launch, show_error=True, inbrowser=True, server_name=args.server_name, server_port=args.server_port, share=False)

    asyncio.run(main())
