<?php
/**
 * Admin Group List Tmpl
 *
 * @package     Joomla.Administrator
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005 Fabrik. All rights reserved.
 * @license     http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 * @since       3.0
 */

// No direct access
defined('_JEXEC') or die;

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');
JHtml::_('behavior.tooltip');
JHTML::_('script', 'system/multiselect.js', false, true);
$user = JFactory::getUser();
$userId = $user->get('id');
$listOrder = $this->state->get('list.ordering');
$listDirn = $this->state->get('list.direction');
?>
<form action="<?php echo JRoute::_('index.php?option=com_fabrik&view=groups'); ?>" method="post" name="adminForm" id="adminForm">

<div id="filter-bar" class="btn-toolbar">
		<div class="row-fluid">
			<div class="span2 offset4">

				<select name="filter_form" class="inputbox" onchange="this.form.submit()">
					<option value=""><?php echo JText::_('COM_FABRIK_SELECT_FORM'); ?></option>
					<?php echo JHtml::_('select.options', $this->formOptions, 'value', 'text', $this->state->get('filter.form'), true); ?>
				</select>

			</div>
			<div class="span2">
				<?php if (!empty($this->packageOptions)) {?>
				<select name="package" class="inputbox" onchange="this.form.submit()">
					<option value="fabrik"><?php echo JText::_('COM_FABRIK_SELECT_PACKAGE');?></option>
					<?php echo JHtml::_('select.options', $this->packageOptions, 'value', 'text', $this->state->get('com_fabrik.package'), true);?>
				</select>
				<?php }?>


				<select name="filter_published" class="inputbox" onchange="this.form.submit()">
					<option value=""><?php echo JText::_('JOPTION_SELECT_PUBLISHED');?></option>
					<?php echo JHtml::_('select.options', JHtml::_('jgrid.publishedOptions', array('archived' => false)), 'value', 'text', $this->state->get('filter.published'), true);?>
				</select>
			</div>

			<div class="span4">
				<div class="filter-search btn-group pull-left">
					<label class="element-invisible" for="filter_search"><?php echo JText::_('JSEARCH_FILTER_LABEL'); ?></label>
					<input type="text" name="filter_search" placeholder="<?php echo JText::_('JSEARCH_FILTER_LABEL'); ?>" id="filter_search" value="<?php echo $this->state->get('filter.search'); ?>"
					title="<?php echo JText::_('COM_FABRIK_SEARCH_IN_TITLE'); ?>" />&nbsp;
				</div>
				<div class="btn-group pull-left hidden-phone">
					<button class="btn tip" type="submit" rel="tooltip" title="<?php echo JText::_('JSEARCH_FILTER_SUBMIT'); ?>"><i class="icon-search"></i></button>
					<button class="btn tip" type="button" onclick="document.id('filter_search').value='';this.form.submit();" rel="tooltip" title="<?php echo JText::_('JSEARCH_FILTER_CLEAR'); ?>"><i class="icon-remove"></i></button>
				</div>
			</div>
		</div>

	</div>


	<div class="clearfix"> </div>
	<table class="table table-striped">
		<thead>
			<tr>
				<th width="2%">
					<?php echo JHTML::_('grid.sort', 'JGRID_HEADING_ID', 'g.id', $listDirn, $listOrder); ?>
				</th>
				<th width="1%">
					<input type="checkbox" name="toggle" value="" onclick="checkAll(this);" />
				</th>
				<th width="30%" >
					<?php echo JHTML::_('grid.sort', 'COM_FABRIK_NAME', 'g.name', $listDirn, $listOrder); ?>
				</th>
				<th width="30%" >
					<?php echo JHTML::_('grid.sort', 'COM_FABRIK_LABEL', 'g.label', $listDirn, $listOrder); ?>
				</th>
				<th width="30%">
					<?php echo JHTML::_('grid.sort', 'COM_FABRIK_FORM', 'f.label', $listDirn, $listOrder); ?>
				</th>
				<th width="31%">
					<?php echo JText::_('COM_FABRIK_ELEMENTS'); ?>
				</th>
				<th width="5%">
				<?php echo JHTML::_('grid.sort', 'JPUBLISHED', 'g.published', $listDirn, $listOrder); ?>
				</th>
			</tr>
		</thead>
		<tfoot>
			<tr>
				<td colspan="7">
					<?php echo $this->pagination->getListFooter(); ?>
				</td>
			</tr>
		</tfoot>
		<tbody>
		<?php foreach ($this->items as $i => $item) :
	$ordering = ($listOrder == 'ordering');
	$link = JRoute::_('index.php?option=com_fabrik&task=group.edit&id=' . (int) $item->id);
	$canCreate = $user->authorise('core.create', 'com_fabrik.group.' . $item->form_id);
	$canEdit = $user->authorise('core.edit', 'com_fabrik.group.' . $item->form_id);
	$canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out == $user->get('id') || $item->checked_out == 0;
	$canChange = $user->authorise('core.edit.state', 'com_fabrik.group.' . $item->form_id) && $canCheckin;
			   ?>

			<tr class="row<?php echo $i % 2; ?>">
					<td>
						<?php echo $item->id; ?>
					</td>
					<td>
						<?php echo JHtml::_('grid.id', $i, $item->id); ?>
					</td>
					<td>
						<?php
	if ($item->checked_out && ($item->checked_out != $user->get('id'))) :
		echo $item->name;
	else :
?>
						<a href="<?php echo $link; ?>">
							<?php echo $item->name; ?>
						</a>
					<?php endif; ?>
					<td>
						<?php echo $item->label; ?>
					</td>
					</td>
					<td>
						<?php echo "($item->form_id) " . $item->flabel; ?>
					</td>
					<td>
						<?php echo $item->_elementCount; ?>
						<a href="index.php?option=com_fabrik&view=element&layout=edit&filter_groupId=<?php echo $item->id ?>">
						<?php echo JText::_('COM_FABRIK_ADD')?>
						</a>
					</td>
					<td>
						<?php echo JHtml::_('jgrid.published', $item->published, $i, 'groups.', $canChange); ?>
					</td>
				</tr>

			<?php endforeach; ?>
		</tbody>
	</table>

	<input type="hidden" name="task" value="" />
	<input type="hidden" name="boxchecked" value="0" />
	<input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>" />
	<input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>" />
	<?php echo JHtml::_('form.token'); ?>
</form>
