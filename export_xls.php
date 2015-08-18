<?php
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Europe/Bucharest');


if (PHP_SAPI == 'cli'){die('This example should only be run from a Web Browser');}
/** Include PHPExcel */
require_once 'lib/PHPExcel.php';

$xlsdata = json_decode($_POST['xlsdata'], true);	
$data = $xlsdata['data'];
$metatitle =  $xlsdata['metadata']['title'];
$metatext =  $xlsdata['metadata']['text'];


// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

$objPHPExcel->getProperties()->setCreator("George Alexandru Dudău")
							 ->setLastModifiedBy("")
							 ->setTitle($metatitle)
							 ->setSubject($metatitle)
							 ->setDescription("")
							 ->setKeywords("")
							 ->setCategory("");

$letters = range('A','Z');
$count = 0;
$cell_name="";
$objPHPExcel->setActiveSheetIndex(0);
foreach($metatext as $k=>$v){
	$default_border = array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
			'color' => array('rgb'=>'1006A3')
		);
	$styleArray = array(
			'borders' => array(
				'bottom' => $default_border,
				'left' => $default_border,
				'top' => $default_border,
				'right' => $default_border,
			),
			'fill' => array(
				'type' => PHPExcel_Style_Fill::FILL_SOLID,
				'color' => array('rgb'=>'E1E0F7'),
			),
			'font' => array(
				'bold' => true,
			),
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
				'vertical'   => PHPExcel_Style_Alignment::VERTICAL_CENTER,
				'rotation'   => 0,
				'wrap'       => true
			)
		);
	$cell_name = $letters[$count]."1";
	$count++;
	$objPHPExcel->getActiveSheet()->SetCellValue($cell_name, $v);
	$objPHPExcel->getActiveSheet()->getStyle("$cell_name:$cell_name")->applyFromArray($styleArray);
	$objPHPExcel->getActiveSheet()->getColumnDimension($letters[$count])->setAutoSize(true);
	unset($styleArray);
	
	
}
$objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(40);

unset($count);
$count = 0;
foreach($data as $k=>$d){

	foreach($d as $dk =>$dv){
		$default_border = array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
			'color' => array('rgb'=>'1006A3')
		);
		$styleArray = array(
		'borders' => array(
				'bottom' => $default_border,
				'left' => $default_border,
				'top' => $default_border,
				'right' => $default_border,
			)
	);
		$objPHPExcel->getActiveSheet()->SetCellValue($letters[$dk].($k+2), $dv);
		$objPHPExcel->getActiveSheet()->getStyle($letters[$dk].($k+2), $dv)->applyFromArray($styleArray);
	}	
}         
            
// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle($metatitle);            
$objPHPExcel->setActiveSheetIndex(0);  

header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="'.$metatitle.'.xlsx"');
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');
// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0 


$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
exit;
