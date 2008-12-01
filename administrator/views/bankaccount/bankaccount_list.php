<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Smart Restaurant
 *
 * An open source application to manage restaurants
 *
 * @package		SmartRestaurant
 * @author		Gjergj Sheldija
 * @copyright	Copyright (c) 2008, Gjergj Sheldija
 * @license		http://www.gnu.org/licenses/gpl.txt
 * @since		Version 1.0
 * @filesource
 * 
 *  Smart Restaurant is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, version 3 of the License.
 *
 *	Smart Restaurant is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.

 *	You should have received a copy of the GNU General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */
?>
<script type="text/javascript">
	jQuery().ready(function(){
		jQuery('#tabelapare').accordion({
				header: 'div.mytitle',
			    active: false, 
			    alwaysOpen: false
		});
});
$( function(){
	$("table.zebra tr:even").addClass("even");
	$("table.zebra tr:odd").addClass("odd");
});
</script>
<div id="Container">
	<div class="Full">
		<div class="contentRight">
		<div class="contentLeft">
		<div class="col">
			<div class="Left">
				<h2><?=lang('bank_account'); ?> :: <?=anchor('bankaccount/newBankAccount',lang('new_bank_account')) ?></h2>
				<div class="basic" style="float:left;"  id="tabelapare">
						<?php 
						$tmp = "";
						foreach($query->result() as $row) {	
							if($tmp != $row->bankname) {
								echo '<div class="mytitle">'.$row->bankname.'</div>';?>
							<table class="zebra">
								<colgroup>
									<col style='width:90%;' />
									<col style='width:10%;' />
								</colgroup>
								<thead>
									<tr>
										<th><?=lang('name'); ?></th>
										<th><?=lang('action'); ?>&nbsp;&nbsp;</th>
									</tr>
								</thead>	
						<?php		
							}						
						?>		<tr>
									<td><?=$row->name ?></td>
									<td><?=anchor_image('bankaccount/edit/'.$row->id, '../img/edit.png');?> :: <?=anchor_image('bankaccount/delete/'.$row->id , '../img/edit_remove.png');?></td>
								</tr>
						<?php 
							$kot = $query->next_row();
							$tmp = $kot->bankname;
							if($tmp != $row->bankname) {
								$tmp = $row->bankname;
								echo "</table>";
							}
						}; 
						?>
					</table>
			</div>	
			</div>
			<div class="Right">				
				<?php $this->load->view('bankaccount/bankaccount_edit') ?>
			</div>
        </div>
        </div>
		</div>
	</div>
</div>
<div class="ClearAll"></div>